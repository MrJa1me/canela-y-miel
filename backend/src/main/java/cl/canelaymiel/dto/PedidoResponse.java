package cl.canelaymiel.dto;

import cl.canelaymiel.model.DetallePedido;
import cl.canelaymiel.model.Pedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        LocalDateTime fecha,
        String cliente,
        String correo,
        String estado,
        BigDecimal subtotal,
        BigDecimal descuento,
        BigDecimal envio,
        BigDecimal total,
        String cuponCodigo,
        List<DetalleResponse> detalles) {

    public static PedidoResponse desde(Pedido pedido) {
        return new PedidoResponse(
                pedido.getId(),
                pedido.getFecha(),
                pedido.getCliente().getNombre(),
                pedido.getCliente().getCorreo(),
                pedido.getEstado().getNombre(),
                pedido.getSubtotal(),
                pedido.getDescuento(),
                pedido.getEnvio(),
                pedido.getTotal(),
                pedido.getCupon() == null ? null : pedido.getCupon().getCodigo(),
                pedido.getDetalles().stream().map(DetalleResponse::desde).toList());
    }

    public record DetalleResponse(
            Long productoId,
            String producto,
            Integer cantidad,
            BigDecimal precioUnitario,
            BigDecimal subtotal) {

        public static DetalleResponse desde(DetallePedido detalle) {
            return new DetalleResponse(
                    detalle.getProducto().getId(),
                    detalle.getProducto().getNombre(),
                    detalle.getCantidad(),
                    detalle.getPrecioUnitario(),
                    detalle.getSubtotal());
        }
    }
}
