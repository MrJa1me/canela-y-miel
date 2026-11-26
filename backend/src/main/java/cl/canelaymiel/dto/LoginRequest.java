package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "El correo es obligatorio")
        @Schema(example = "admin@canelaymiel.cl") String correo,
        @NotBlank(message = "La contraseña es obligatoria")
        @Schema(example = "Admin1234") String password) {
}
