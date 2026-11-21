package cl.canelaymiel.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank(message = "El token de refresco es obligatorio") String refreshToken) {
}
