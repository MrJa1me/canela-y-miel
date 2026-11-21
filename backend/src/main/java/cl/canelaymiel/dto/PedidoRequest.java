package cl.canelaymiel.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PedidoRequest(
        @NotNull(message = "El cliente es obligatorio") Long clienteId,
        // Opcional: si viene, se valida y se aplica el descuento.
        String cuponCodigo,
        @NotEmpty(message = "El pedido debe tener al menos un producto")
        @Valid List<DetallePedidoRequest> detalles) {
}
