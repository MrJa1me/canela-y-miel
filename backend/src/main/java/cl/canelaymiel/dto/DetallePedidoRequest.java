package cl.canelaymiel.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record DetallePedidoRequest(
        @NotNull(message = "El producto es obligatorio") Long productoId,
        @NotNull(message = "La cantidad es obligatoria")
        @Positive(message = "La cantidad debe ser mayor que cero") Integer cantidad,
        // Opcional: mensaje de personalización de la torta.
        @Size(max = 200, message = "El mensaje no puede superar los 200 caracteres") String mensaje) {
}
