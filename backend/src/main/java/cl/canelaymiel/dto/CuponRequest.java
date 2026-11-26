package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CuponRequest(
        @NotBlank(message = "El código es obligatorio")
        @Schema(example = "MIEL10") String codigo,
        @NotNull(message = "El porcentaje es obligatorio")
        @Min(value = 1, message = "El porcentaje mínimo es 1")
        @Max(value = 100, message = "El porcentaje máximo es 100")
        @Schema(example = "10") Integer porcentaje,
        @Schema(example = "true") Boolean activo) {
}
