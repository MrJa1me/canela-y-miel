package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record DetallePedidoRequest(
        @NotNull(message = "El producto es obligatorio")
        @Schema(example = "1") Long productoId,
        @NotNull(message = "La cantidad es obligatoria")
        @Positive(message = "La cantidad debe ser mayor que cero")
        @Schema(example = "2") Integer cantidad,
        // Opcional: mensaje de personalización de la torta.
        @Size(max = 200, message = "El mensaje no puede superar los 200 caracteres")
        @Schema(example = "Feliz cumpleaños") String mensaje) {
}
