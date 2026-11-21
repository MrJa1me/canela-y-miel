package cl.canelaymiel.dto;

import jakarta.validation.constraints.NotBlank;

public record CambioEstadoRequest(
        @NotBlank(message = "El estado es obligatorio") String estado) {
}
