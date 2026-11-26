package cl.canelaymiel.config;

import cl.canelaymiel.model.Categoria;
import cl.canelaymiel.model.Cupon;
import cl.canelaymiel.model.DetallePedido;
import cl.canelaymiel.model.EstadoPedido;
import cl.canelaymiel.model.Pedido;
import cl.canelaymiel.model.Producto;
import cl.canelaymiel.model.Rol;
import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.repository.CategoriaRepository;
import cl.canelaymiel.repository.CuponRepository;
import cl.canelaymiel.repository.EstadoPedidoRepository;
import cl.canelaymiel.repository.PedidoRepository;
import cl.canelaymiel.repository.ProductoRepository;
import cl.canelaymiel.repository.RolRepository;
import cl.canelaymiel.repository.UsuarioRepository;
import cl.canelaymiel.service.ReglasCliente;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

// Datos de prueba. La base (roles, usuarios, cupones) se crea una sola vez;
// el catálogo se completa siempre y los movimientos solo si no hay pedidos.
@Component
@RequiredArgsConstructor
public class DatosSemilla implements CommandLineRunner {

    private static final BigDecimal ENVIO_DEMO = new BigDecimal("8000");
    private static final String CLAVE_DEMO = "Cliente1234";

    private final RolRepository rolRepository;
    private final EstadoPedidoRepository estadoPedidoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CuponRepository cuponRepository;
    private final PedidoRepository pedidoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (rolRepository.count() == 0) {
            sembrarBase();
        }
        sembrarCatalogo();
        asegurarClientesDemo();
        sembrarMovimientos();
    }

    private void sembrarBase() {
        Rol admin = rolRepository.save(new Rol("ADMIN"));
        Rol cliente = rolRepository.save(new Rol("CLIENTE"));

        estadoPedidoRepository.save(new EstadoPedido("Recibido", 1));
        estadoPedidoRepository.save(new EstadoPedido("En preparación", 2));
        estadoPedidoRepository.save(new EstadoPedido("Listo para despacho", 3));
        estadoPedidoRepository.save(new EstadoPedido("En camino", 4));
        estadoPedidoRepository.save(new EstadoPedido("Entregado", 5));

        // Contraseñas de prueba: Admin1234 y Cliente1234 (ver README).
        usuarioRepository.save(new Usuario("Administrador", "admin@canelaymiel.cl", passwordEncoder.encode("Admin1234"), false, true, admin));
        usuarioRepository.save(new Usuario("Cliente Demo", "cliente@canelaymiel.cl", passwordEncoder.encode("Cliente1234"), true, true, cliente));

        cuponRepository.save(new Cupon("MIEL10", 10, true));
        cuponRepository.save(new Cupon("CANELA20", 20, false));
    }

    // Crea lo que falte sin borrar nada, para que una base ya usada reciba el catálogo del caso.
    private void sembrarCatalogo() {
        Categoria cuadradas = categoria("Tortas Cuadradas", "Tortas");
        Categoria circulares = categoria("Tortas Circulares");
        Categoria postres = categoria("Postres Individuales", "Postres");
        Categoria sinAzucar = categoria("Productos Sin Azúcar");
        Categoria tradicional = categoria("Pastelería Tradicional");
        Categoria sinGluten = categoria("Productos Sin Gluten", "Sin gluten");
        Categoria vegana = categoria("Productos Vegana");
        Categoria especiales = categoria("Tortas Especiales");

        producto("TC001", "Torta Cuadrada de Chocolate", 45000, 10, 20, "/img/chocolate.jpg", cuadradas,
                "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.");
        producto("TC002", "Torta Cuadrada de Frutas", 50000, 8, 24, "/img/tartaleta.jpg", cuadradas,
                "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.");
        producto("TT001", "Torta Circular de Vainilla", 40000, 12, 12, "/img/placeholder.svg", circulares,
                "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.");
        producto("TT002", "Torta Circular de Manjar", 42000, 9, 16, "/img/tres_leches.jpg", circulares,
                "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.");
        producto("PI001", "Mousse de Chocolate", 5000, 30, 1, "/img/chocolate.jpg", postres,
                "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.");
        producto("PI002", "Tiramisú Clásico", 5500, 24, 1, "/img/placeholder.svg", postres,
                "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.");
        producto("PSA001", "Torta Sin Azúcar de Naranja", 48000, 6, 12, "/img/zanahoria.jpg", sinAzucar,
                "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.");
        producto("PSA002", "Cheesecake Sin Azúcar", 47000, 7, 10, "/img/cheesecake.jpg", sinAzucar,
                "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.");
        producto("PT001", "Empanada de Manzana", 3000, 40, 1, "/img/placeholder.svg", tradicional,
                "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.");
        producto("PT002", "Tarta de Santiago", 6000, 18, 8, "/img/placeholder.svg", tradicional,
                "Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos.");
        producto("PG001", "Brownie Sin Gluten", 4000, 20, 1, "/img/chocolate.jpg", sinGluten,
                "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.");
        producto("PG002", "Pan Sin Gluten", 3500, 15, 8, "/img/placeholder.svg", sinGluten,
                "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.");
        producto("PV001", "Torta Vegana de Chocolate", 50000, 8, 12, "/img/chocolate.jpg", vegana,
                "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.");
        producto("PV002", "Galletas Veganas de Avena", 4500, 25, 12, "/img/macarons.jpg", vegana,
                "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.");
        producto("TE001", "Torta Especial de Cumpleaños", 55000, 5, 30, "/img/tres_leches.jpg", especiales,
                "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.");
        producto("TE002", "Torta Especial de Boda", 60000, 4, 40, "/img/placeholder.svg", especiales,
                "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.");

        // El catálogo viejo (sin código) se desactiva en vez de borrarse:
        // así los pedidos históricos siguen siendo válidos.
        for (Producto producto : productoRepository.findAll()) {
            if (producto.getCodigo() == null) {
                producto.setActivo(false);
            }
        }
    }

    // Clientes extra para el panel y el mostrador. Se crean una sola vez.
    private void asegurarClientesDemo() {
        cliente("María González", "maria@duoc.cl", LocalDate.now().minusYears(21).plusDays(5),
                ReglasCliente.CODIGO_FELICES50, false);
        cliente("Pedro Soto", "pedro@correo.cl", LocalDate.of(1962, 5, 10), null, false);
        cliente("Cliente Mostrador", "mostrador@canelaymiel.cl", null, null, false);
    }

    // Movimientos de ejemplo para que el dashboard no arranque vacío.
    private void sembrarMovimientos() {
        if (pedidoRepository.count() > 0) {
            return;
        }

        Usuario demo = usuario("cliente@canelaymiel.cl");
        Usuario maria = usuario("maria@duoc.cl");
        Usuario pedro = usuario("pedro@correo.cl");
        Usuario mostrador = usuario("mostrador@canelaymiel.cl");

        pedidoDemo(demo, 6, 5, new String[][]{{"TC001", "1"}, {"PI002", "1"}});
        pedidoDemo(maria, 6, 5, new String[][]{{"TT002", "1"}});
        pedidoDemo(pedro, 5, 5, new String[][]{{"TC002", "1"}});
        pedidoDemo(mostrador, 5, 5, new String[][]{{"PT001", "4"}, {"PT002", "2"}});
        pedidoDemo(demo, 4, 5, new String[][]{{"PV001", "1"}});
        pedidoDemo(maria, 4, 5, new String[][]{{"PI001", "3"}});
        pedidoDemo(pedro, 3, 4, new String[][]{{"TE002", "1"}});
        pedidoDemo(mostrador, 3, 4, new String[][]{{"TC001", "1"}, {"PV002", "2"}});
        pedidoDemo(demo, 2, 3, new String[][]{{"TT001", "1"}});
        pedidoDemo(maria, 2, 3, new String[][]{{"PG001", "2"}, {"PG002", "1"}});
        pedidoDemo(pedro, 1, 2, new String[][]{{"TC001", "1"}});
        pedidoDemo(mostrador, 1, 2, new String[][]{{"PI002", "2"}, {"PT002", "1"}});
        pedidoDemo(demo, 0, 1, new String[][]{{"TE001", "1"}});
        pedidoDemo(maria, 0, 1, new String[][]{{"PSA002", "1"}, {"PV002", "1"}});
    }

    private void pedidoDemo(Usuario cliente, int diasAtras, int ordenEstado, String[][] lineas) {
        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (String[] linea : lineas) {
            Producto producto = productoRepository.findByCodigoIgnoreCase(linea[0]).orElse(null);
            if (producto == null) {
                continue;
            }

            int cantidad = Integer.parseInt(linea[1]);
            BigDecimal importe = producto.getPrecio().multiply(BigDecimal.valueOf(cantidad));

            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(cantidad);
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(importe);
            detalles.add(detalle);
            subtotal = subtotal.add(importe);
        }

        if (detalles.isEmpty()) {
            return;
        }

        BigDecimal descuento = subtotal.multiply(porcentajeDemo(cliente)).setScale(0, RoundingMode.HALF_UP);

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEstado(estadoPedidoRepository.findByOrden(ordenEstado)
                .orElseThrow(() -> new IllegalStateException("Falta el estado " + ordenEstado)));
        pedido.setFecha(LocalDateTime.now().minusDays(diasAtras).minusHours(ordenEstado));
        pedido.setFechaEntrega(LocalDate.now().minusDays(diasAtras).plusDays(2));
        pedido.setDireccion("Retiro en el local");
        pedido.setTelefono("912345678");
        pedido.setSubtotal(subtotal);
        pedido.setDescuento(descuento);
        pedido.setEnvio(ENVIO_DEMO);
        pedido.setTotal(subtotal.subtract(descuento).add(ENVIO_DEMO));

        detalles.forEach(pedido::agregarDetalle);
        pedidoRepository.save(pedido);
    }

    private BigDecimal porcentajeDemo(Usuario cliente) {
        LocalDate hoy = LocalDate.now();

        if (ReglasCliente.esMayorDe50(cliente.getFechaNacimiento(), hoy)) {
            return new BigDecimal("0.50");
        }
        if (cliente.isPremium() || ReglasCliente.CODIGO_FELICES50.equals(cliente.getCodigoPromocional())) {
            return new BigDecimal("0.10");
        }
        return BigDecimal.ZERO;
    }

    // Busca la categoría; si existe la vieja, la renombra para no dejar opciones repetidas en el filtro.
    private Categoria categoria(String nombre, String nombreAnterior) {
        Optional<Categoria> actual = categoriaRepository.findByNombreIgnoreCase(nombre);
        if (actual.isPresent()) {
            return actual.get();
        }

        Optional<Categoria> anterior = categoriaRepository.findByNombreIgnoreCase(nombreAnterior);
        if (anterior.isPresent()) {
            Categoria categoria = anterior.get();
            categoria.setNombre(nombre);
            return categoria;
        }

        return categoriaRepository.save(new Categoria(nombre));
    }

    private Categoria categoria(String nombre) {
        return categoriaRepository.findByNombreIgnoreCase(nombre)
                .orElseGet(() -> categoriaRepository.save(new Categoria(nombre)));
    }

    private void producto(String codigo, String nombre, int precio, int stock, int porciones,
                          String imagen, Categoria categoria, String descripcion) {
        if (productoRepository.findByCodigoIgnoreCase(codigo).isPresent()) {
            return;
        }

        Producto producto = new Producto(nombre, BigDecimal.valueOf(precio), stock, imagen, categoria, true);
        producto.setCodigo(codigo);
        producto.setDescripcion(descripcion);
        producto.setPorciones(porciones);
        productoRepository.save(producto);
    }

    private void cliente(String nombre, String correo, LocalDate nacimiento, String codigo, boolean premium) {
        usuarioRepository.findByCorreoIgnoreCase(correo).orElseGet(() -> {
            Rol rol = rolRepository.findByNombre("CLIENTE")
                    .orElseThrow(() -> new IllegalStateException("Falta el rol CLIENTE"));

            Usuario usuario = new Usuario(nombre, correo, passwordEncoder.encode(CLAVE_DEMO), premium, true, rol);
            usuario.setFechaNacimiento(nacimiento);
            usuario.setCodigoPromocional(codigo);
            usuario.setCorreoInstitucional(ReglasCliente.esCorreoInstitucional(correo));
            return usuarioRepository.save(usuario);
        });
    }

    private Usuario usuario(String correo) {
        return usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new IllegalStateException("Falta el usuario " + correo));
    }
}
