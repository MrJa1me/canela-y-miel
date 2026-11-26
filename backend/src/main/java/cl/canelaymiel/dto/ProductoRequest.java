package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record ProductoRequest(
        @NotBlank(message = "El código es obligatorio")
        @Schema(example = "TC001", description = "Código del catálogo")
        String codigo,
        @NotBlank(message = "El nombre es obligatorio")
        @Schema(example = "Torta Cuadrada de Chocolate")
        String nombre,
        @NotBlank(message = "La descripción es obligatoria")
        @Schema(example = "Torta de chocolate con capas de ganache y avellanas.")
        String descripcion,
        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor que cero")
        @Schema(example = "45000")
        BigDecimal precio,
        @NotNull(message = "El stock es obligatorio")
        @PositiveOrZero(message = "El stock no puede ser negativo")
        @Schema(example = "8")
        Integer stock,
        @NotNull(message = "Las porciones son obligatorias")
        @Positive(message = "Las porciones deben ser mayores que cero")
        @Schema(example = "20", description = "Porciones aproximadas")
        Integer porciones,
        @NotBlank(message = "La imagen es obligatoria")
        @Schema(example = "/img/chocolate.jpg")
        String imagen,
        @NotNull(message = "La categoría es obligatoria")
        @Schema(example = "1")
        Long categoriaId,
        @Schema(example = "true")
        Boolean activo) {
}
