package cl.canelaymiel.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.canelaymiel.dto.CambioEstadoRequest;
import cl.canelaymiel.dto.DetallePedidoRequest;
import cl.canelaymiel.dto.PedidoRequest;
import cl.canelaymiel.dto.PedidoResponse;
import cl.canelaymiel.exception.ConflictoException;
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

    @BeforeEach
    void preparar() {
        cliente = new Usuario("Cliente", "cliente@correo.cl", "clave", true, true, new Rol("CLIENTE"));
        cliente.setId(1L);

        producto = new Producto("Torta", new BigDecimal("10000"), 5, "/img/chocolate.jpg", new Categoria("Tortas"), true);
        producto.setId(10L);

        recibido = new EstadoPedido("Recibido", 1);
    }

    @Test
    void creaPedidoConDescuentoPremiumYCupon() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(estadoPedidoRepository.findByOrden(1)).thenReturn(Optional.of(recibido));
        when(cuponRepository.findByCodigoIgnoreCase("MIEL10"))
                .thenReturn(Optional.of(new Cupon("MIEL10", 10, true)));
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocacion -> invocacion.getArgument(0));

        PedidoResponse respuesta = pedidoService.crear(
                new PedidoRequest(1L, "MIEL10", List.of(new DetallePedidoRequest(10L, 2))), cliente);

        // 20.000 - 10% premium (2.000) - 10% cupón (1.800) + envío (8.000)
        assertEquals(new BigDecimal("20000"), respuesta.subtotal());
        assertEquals(new BigDecimal("3800"), respuesta.descuento());
        assertEquals(new BigDecimal("8000"), respuesta.envio());
        assertEquals(new BigDecimal("24200"), respuesta.total());
        assertEquals(3, producto.getStock());
    }

    @Test
    void rechazaPedidoSinStockSuficiente() {
        producto.setStock(1);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(estadoPedidoRepository.findByOrden(1)).thenReturn(Optional.of(recibido));
        when(productoRepository.findById(10L)).thenReturn(Optional.of(producto));

        assertThrows(ConflictoException.class, () -> pedidoService.crear(
                new PedidoRequest(1L, null, List.of(new DetallePedidoRequest(10L, 2))), cliente));

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
}
