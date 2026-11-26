package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank(message = "El token de refresco es obligatorio")
        @Schema(example = "eyJhbGciOiJIUzI1NiJ9...") String refreshToken) {
}
