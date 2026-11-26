package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CambioEstadoRequest(
        @NotBlank(message = "El estado es obligatorio")
        @Schema(example = "En preparación") String estado) {
}
