package cl.canelaymiel.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.canelaymiel.dto.CambioEstadoRequest;
import cl.canelaymiel.dto.DetallePedidoRequest;
import cl.canelaymiel.dto.PedidoRequest;
import cl.canelaymiel.dto.PedidoResponse;
import cl.canelaymiel.exception.ConflictoException;
import cl.canelaymiel.exception.DatosInvalidosException;
import cl.canelaymiel.model.Categoria;
import cl.canelaymiel.model.Cupon;
import cl.canelaymiel.model.EstadoPedido;
import cl.canelaymiel.model.Pedido;
import cl.canelaymiel.model.Producto;
import cl.canelaymiel.model.Rol;
import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.repository.CuponRepository;
import cl.canelaymiel.repository.EstadoPedidoRepository;
import cl.canelaymiel.repository.PedidoRepository;
import cl.canelaymiel.repository.ProductoRepository;
import cl.canelaymiel.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

// Pruebas de la lógica de negocio de pedidos, sin base de datos.
@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private ProductoRepository productoRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private CuponRepository cuponRepository;
    @Mock
    private EstadoPedidoRepository estadoPedidoRepository;

    @InjectMocks
    private PedidoService pedidoService;

    private Usuario cliente;
    private Producto producto;
    private EstadoPedido recibido;
    private Categoria categoria;

    @BeforeEach
    void preparar() {
        cliente = new Usuario("Cliente", "cliente@correo.cl", "clave", false, true, new Rol("CLIENTE"));
        cliente.setId(1L);

        categoria = new Categoria("Tortas Cuadradas");
        producto = new Producto("Torta Cuadrada de Chocolate", new BigDecimal("10000"), 5, "/img/chocolate.jpg", categoria, true);
        producto.setId(10L);

        recibido = new EstadoPedido("Recibido", 1);
    }

    @Test
    void clientePremiumRecibeDiezPorCiento() {
        cliente.setPremium(true);
        prepararPedidoBasico();
        when(cuponRepository.findByCodigoIgnoreCase("MIEL10"))
                .thenReturn(Optional.of(new Cupon("MIEL10", 10, true)));

        PedidoResponse respuesta = pedidoService.crear(
                pedido("MIEL10", new DetallePedidoRequest(10L, 2, null)), cliente);

        // Subtotal 20.000: gana el 10% (premium y cupón valen lo mismo, no se suman).
        assertEquals(new BigDecimal("20000"), respuesta.subtotal());
        assertEquals(new BigDecimal("2000"), respuesta.descuento());
        assertEquals(new BigDecimal("26000"), respuesta.total());
        assertEquals(3, producto.getStock());
    }

    @Test
    void mayorDe50RecibeLaMitad() {
        cliente.setFechaNacimiento(LocalDate.now().minusYears(60));
        prepararPedidoBasico();

        PedidoResponse respuesta = pedidoService.crear(
                pedido(null, new DetallePedidoRequest(10L, 2, null)), cliente);

        assertEquals(new BigDecimal("10000"), respuesta.descuento());
        assertEquals(new BigDecimal("18000"), respuesta.total());
    }

    @Test
    void felices50RecibeDiezPorCientoDePorVida() {
        cliente.setCodigoPromocional("FELICES50");
        prepararPedidoBasico();

        PedidoResponse respuesta = pedidoService.crear(
                pedido(null, new DetallePedidoRequest(10L, 2, null)), cliente);

        assertEquals(new BigDecimal("2000"), respuesta.descuento());
        assertEquals(new BigDecimal("26000"), respuesta.total());
    }

    @Test
    void combinacionAplicaSoloElMayorDescuento() {
        cliente.setFechaNacimiento(LocalDate.now().minusYears(60));
        cliente.setCodigoPromocional("FELICES50");
        prepararPedidoBasico();
        when(cuponRepository.findByCodigoIgnoreCase("CANELA20"))
                .thenReturn(Optional.of(new Cupon("CANELA20", 20, true)));

        PedidoResponse respuesta = pedidoService.crear(
                pedido("CANELA20", new DetallePedidoRequest(10L, 2, null)), cliente);

        // 50% gana al 20% del cupón; no se suman.
        assertEquals(new BigDecimal("10000"), respuesta.descuento());
        assertEquals(new BigDecimal("18000"), respuesta.total());
    }

    @Test
    void cumpleanosDuocRegalaLaTortaMasBarata() {
        cliente.setFechaNacimiento(LocalDate.now().minusYears(20));
        cliente.setCorreoInstitucional(true);
        prepararPedidoBasico();

        Producto tortaBarata = new Producto("Torta Circular de Vainilla", new BigDecimal("15000"), 3, "/img/placeholder.svg", categoria, true);
        tortaBarata.setId(11L);
        when(productoRepository.findById(11L)).thenReturn(Optional.of(tortaBarata));

        PedidoResponse respuesta = pedidoService.crear(
                pedido(null,
                        new DetallePedidoRequest(10L, 1, "Feliz cumpleaños"),
                        new DetallePedidoRequest(11L, 1, null)),
                cliente);

        // Subtotal 25.000 y se regala la torta más barata (10.000); sin otros descuentos.
        assertEquals(new BigDecimal("25000"), respuesta.subtotal());
        assertEquals(new BigDecimal("10000"), respuesta.descuento());
        assertEquals(new BigDecimal("23000"), respuesta.total());
        assertEquals("Feliz cumpleaños", respuesta.detalles().get(0).mensaje());
    }

    @Test
    void noRegalaLaTortaSiEsLoUnicoDelPedido() {
        cliente.setFechaNacimiento(LocalDate.now().minusYears(20));
        cliente.setCorreoInstitucional(true);
        prepararPedidoBasico();

        PedidoResponse respuesta = pedidoService.crear(
                pedido(null, new DetallePedidoRequest(10L, 1, null)), cliente);

        // Una sola torta en el pedido: no hay nada más pagado, así que no se regala.
        assertEquals(BigDecimal.ZERO, respuesta.descuento());
        assertEquals(new BigDecimal("18000"), respuesta.total());
    }

    @Test
    void creaPedidoDeMostradorSinDireccionNiTelefono() {
        prepararPedidoBasico();

        PedidoResponse respuesta = pedidoService.crear(
                new PedidoRequest(1L, null, LocalDate.now(), null, "", true, List.of(
                        new DetallePedidoRequest(10L, 1, null))),
                cliente);

        assertEquals(BigDecimal.ZERO, respuesta.envio());
        assertEquals(new BigDecimal("10000"), respuesta.total());
        assertEquals(null, respuesta.direccion());
        assertEquals(null, respuesta.telefono());
        assertTrue(respuesta.retiro());
    }

    @Test
    void rechazaFechaDeEntregaPasada() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(estadoPedidoRepository.findByOrden(1)).thenReturn(Optional.of(recibido));

        PedidoRequest request = new PedidoRequest(
                1L, null, LocalDate.now().minusDays(1), "Av. Siempre Viva 123", "912345678",
                false, List.of(new DetallePedidoRequest(10L, 1, null)));

        assertThrows(DatosInvalidosException.class, () -> pedidoService.crear(request, cliente));
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    @Test
    void rechazaPedidoSinStockSuficiente() {
        producto.setStock(1);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(estadoPedidoRepository.findByOrden(1)).thenReturn(Optional.of(recibido));
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));

        assertThrows(ConflictoException.class, () -> pedidoService.crear(
                pedido(null, new DetallePedidoRequest(10L, 2, null)), cliente));

        assertEquals(1, producto.getStock());
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    @Test
    void rechazaCambioDeEstadoQueSeSaltaPasos() {
        Pedido pedido = new Pedido();
        pedido.setId(5L);
        pedido.setCliente(cliente);
        pedido.setEstado(recibido);

        when(pedidoRepository.findById(5L)).thenReturn(Optional.of(pedido));
        when(estadoPedidoRepository.findByOrden(2))
                .thenReturn(Optional.of(new EstadoPedido("En preparación", 2)));

        assertThrows(ConflictoException.class,
                () -> pedidoService.cambiarEstado(5L, new CambioEstadoRequest("Entregado")));
    }

    // Mocks comunes para un pedido válido de una línea.
    private void prepararPedidoBasico() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(estadoPedidoRepository.findByOrden(1)).thenReturn(Optional.of(recibido));
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocacion -> invocacion.getArgument(0));
    }

    private PedidoRequest pedido(String cupon, DetallePedidoRequest... detalles) {
        return new PedidoRequest(
                1L, cupon, LocalDate.now().plusDays(1), "Av. Siempre Viva 123", "912345678",
                false, List.of(detalles));
    }
}
