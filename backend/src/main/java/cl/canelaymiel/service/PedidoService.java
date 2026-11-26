package cl.canelaymiel.service;

import cl.canelaymiel.dto.CambioEstadoRequest;
import cl.canelaymiel.dto.DetallePedidoRequest;
import cl.canelaymiel.dto.PedidoRequest;
import cl.canelaymiel.dto.PedidoResponse;
import cl.canelaymiel.exception.AccesoDenegadoException;
import cl.canelaymiel.exception.ConflictoException;
import cl.canelaymiel.exception.DatosInvalidosException;
import cl.canelaymiel.exception.RecursoNoEncontradoException;
import cl.canelaymiel.model.Cupon;
import cl.canelaymiel.model.DetallePedido;
import cl.canelaymiel.model.EstadoPedido;
import cl.canelaymiel.model.Pedido;
import cl.canelaymiel.model.Producto;
import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.repository.CuponRepository;
import cl.canelaymiel.repository.EstadoPedidoRepository;
import cl.canelaymiel.repository.PedidoRepository;
import cl.canelaymiel.repository.ProductoRepository;
import cl.canelaymiel.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private static final BigDecimal ENVIO = new BigDecimal("8000");
    private static final BigDecimal DESCUENTO_MAYOR_50 = new BigDecimal("0.50");
    private static final BigDecimal DESCUENTO_DIEZ = new BigDecimal("0.10");

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CuponRepository cuponRepository;
    private final EstadoPedidoRepository estadoPedidoRepository;

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(Usuario autenticado) {
        List<Pedido> pedidos = esAdmin(autenticado)
                ? pedidoRepository.findAll()
                : pedidoRepository.findByClienteId(autenticado.getId());

        return pedidos.stream().map(PedidoResponse::desde).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse obtener(Long id, Usuario autenticado) {
        Pedido pedido = buscar(id);

        if (!esAdmin(autenticado) && !pedido.getCliente().getId().equals(autenticado.getId())) {
            throw new AccesoDenegadoException("No puedes ver un pedido de otro cliente");
        }

        return PedidoResponse.desde(pedido);
    }

    @Transactional
    public PedidoResponse crear(PedidoRequest request, Usuario autenticado) {
        if (!esAdmin(autenticado) && !request.clienteId().equals(autenticado.getId())) {
            throw new AccesoDenegadoException("Solo puedes crear pedidos para tu propia cuenta");
        }

        Usuario cliente = usuarioRepository.findById(request.clienteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado"));

        if (!cliente.isActivo()) {
            throw new DatosInvalidosException("El cliente está inactivo");
        }

        EstadoPedido estadoInicial = estadoPedidoRepository.findByOrden(1)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el estado inicial del pedido"));

        Cupon cupon = buscarCupon(request.cuponCodigo());

        LocalDate hoy = LocalDate.now();
        if (request.fechaEntrega() == null || request.fechaEntrega().isBefore(hoy)) {
            throw new DatosInvalidosException("La fecha de entrega no puede ser pasada");
        }

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEstado(estadoInicial);
        pedido.setFecha(LocalDateTime.now());
        pedido.setFechaEntrega(request.fechaEntrega());
        pedido.setDireccion(request.direccion().trim());
        pedido.setTelefono(request.telefono().trim());
        pedido.setCupon(cupon);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (DetallePedidoRequest item : request.detalles()) {
            Producto producto = productoRepository.findById(item.productoId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado: " + item.productoId()));

            if (!producto.isActivo()) {
                throw new DatosInvalidosException("El producto " + producto.getNombre() + " no está disponible");
            }

            if (producto.getStock() < item.cantidad()) {
                throw new ConflictoException("Stock insuficiente para " + producto.getNombre());
            }

            // Descuento de stock: si algo falla después, la transacción lo revierte.
            producto.setStock(producto.getStock() - item.cantidad());

            BigDecimal linea = producto.getPrecio().multiply(BigDecimal.valueOf(item.cantidad()));

            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(linea);
            detalle.setMensaje(item.mensaje() == null || item.mensaje().isBlank() ? null : item.mensaje().trim());
            pedido.agregarDetalle(detalle);

            subtotal = subtotal.add(linea);
        }

        // Orden acordado: 1) se resta la torta gratis, 2) se aplica el MAYOR descuento
        // porcentual (50%, 10% o cupón), 3) se suma el envío fijo.
        BigDecimal tortaGratis = tortaGratis(cliente, pedido.getDetalles(), hoy);
        // Rentabilidad: si el pedido es solo esa torta, no se regala (tiene que haber algo más pagado).
        if (tortaGratis.compareTo(subtotal) >= 0) {
            tortaGratis = BigDecimal.ZERO;
        }
        BigDecimal base = subtotal.subtract(tortaGratis);
        BigDecimal descuentoPorcentual = base
                .multiply(porcentajeDescuento(cliente, cupon, hoy))
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal descuento = descuentoPorcentual.add(tortaGratis);

        pedido.setSubtotal(subtotal);
        pedido.setDescuento(descuento);
        pedido.setEnvio(ENVIO);
        pedido.setTotal(subtotal.subtract(descuento).add(ENVIO).setScale(0, RoundingMode.HALF_UP));

        return PedidoResponse.desde(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoResponse cambiarEstado(Long id, CambioEstadoRequest request) {
        Pedido pedido = buscar(id);

        EstadoPedido siguiente = estadoPedidoRepository.findByOrden(pedido.getEstado().getOrden() + 1)
                .orElseThrow(() -> new ConflictoException("El pedido ya está en el último estado"));

        if (!siguiente.getNombre().equalsIgnoreCase(request.estado().trim())) {
            throw new ConflictoException("El siguiente estado es " + siguiente.getNombre());
        }

        pedido.setEstado(siguiente);
        return PedidoResponse.desde(pedido);
    }

    @Transactional
    public void eliminar(Long id) {
        Pedido pedido = buscar(id);

        // Devolver el stock antes de borrar el pedido.
        for (DetallePedido detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
        }

        pedidoRepository.delete(pedido);
    }

    private boolean esAdmin(Usuario usuario) {
        return "ADMIN".equals(usuario.getRol().getNombre());
    }

    private Pedido buscar(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Pedido no encontrado"));
    }

    private Cupon buscarCupon(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return null;
        }

        Cupon cupon = cuponRepository.findByCodigoIgnoreCase(codigo.trim())
                .orElseThrow(() -> new DatosInvalidosException("El cupón no existe"));

        if (!cupon.isActivo()) {
            throw new DatosInvalidosException("El cupón está inactivo");
        }

        return cupon;
    }

    // Solo se aplica el mayor descuento: nunca se suman porcentajes.
    private BigDecimal porcentajeDescuento(Usuario cliente, Cupon cupon, LocalDate hoy) {
        BigDecimal mayor = BigDecimal.ZERO;

        if (ReglasCliente.esMayorDe50(cliente.getFechaNacimiento(), hoy)) {
            mayor = DESCUENTO_MAYOR_50;
        }

        boolean diez = cliente.isPremium()
                || ReglasCliente.CODIGO_FELICES50.equals(cliente.getCodigoPromocional());
        if (diez && mayor.compareTo(DESCUENTO_DIEZ) < 0) {
            mayor = DESCUENTO_DIEZ;
        }

        if (cupon != null) {
            BigDecimal delCupon = BigDecimal.valueOf(cupon.getPorcentaje())
                    .divide(BigDecimal.valueOf(100));
            if (delCupon.compareTo(mayor) > 0) {
                mayor = delCupon;
            }
        }

        return mayor;
    }

    // Torta gratis de cumpleaños para estudiantes Duoc: se regala la torta más barata.
    // shortcut: "torta" se reconoce por el nombre porque el catálogo del caso las nombra así.
    private BigDecimal tortaGratis(Usuario cliente, List<DetallePedido> detalles, LocalDate hoy) {
        if (!Boolean.TRUE.equals(cliente.getCorreoInstitucional())
                || !ReglasCliente.cumpleAnosHoy(cliente.getFechaNacimiento(), hoy)) {
            return BigDecimal.ZERO;
        }

        return detalles.stream()
                .filter(detalle -> detalle.getProducto().getNombre()
                        .toLowerCase(Locale.ROOT).startsWith("torta"))
                .map(DetallePedido::getPrecioUnitario)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
    }
}
