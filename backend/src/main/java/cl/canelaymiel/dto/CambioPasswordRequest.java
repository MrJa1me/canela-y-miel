package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CambioPasswordRequest(
        @NotBlank(message = "La contraseña actual es obligatoria")
        @Schema(example = "Clave1234") String actual,
        @NotBlank(message = "La contraseña nueva es obligatoria")
        @Size(min = 6, message = "La contraseña nueva debe tener al menos 6 caracteres")
        @Schema(example = "NuevaClave123") String nueva) {
}
