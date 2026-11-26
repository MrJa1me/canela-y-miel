package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PerfilRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
        @Schema(example = "Ana Pérez") String nombre,
        @Size(max = 20, message = "El teléfono no puede superar los 20 caracteres")
        @Pattern(regexp = "^$|^9\\d{8}$", message = "El teléfono debe tener 9 dígitos y empezar con 9")
        @Schema(example = "912345678", description = "Opcional")
        String telefono,
        @Size(max = 200, message = "La dirección no puede superar los 200 caracteres")
        @Schema(example = "Av. Siempre Viva 123", description = "Opcional")
        String direccion,
        @Size(max = 8, message = "Elige como máximo 8 preferencias")
        @Schema(description = "Categorías favoritas; puede ir vacía")
        List<@Size(max = 50, message = "Cada preferencia admite 50 caracteres") String> preferencias,
        @Schema(example = "/img/avatares/avatar-1.svg", description = "Debe ser uno de los 6 avatares disponibles")
        String avatar) {
}
