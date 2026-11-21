package cl.canelaymiel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record ProductoRequest(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor que cero") BigDecimal precio,
        @NotNull(message = "El stock es obligatorio")
        @PositiveOrZero(message = "El stock no puede ser negativo") Integer stock,
        @NotBlank(message = "La imagen es obligatoria") String imagen,
        @NotNull(message = "La categoría es obligatoria") Long categoriaId,
        Boolean activo) {
}
