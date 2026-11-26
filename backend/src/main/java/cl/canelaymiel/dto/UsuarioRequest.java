package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Schema(example = "Cliente Nuevo") String nombre,
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido")
        @Schema(example = "nuevo@correo.cl") String correo,
        // Obligatoria al crear; opcional al actualizar.
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        @Schema(example = "Clave1234", description = "Obligatoria al crear; opcional al actualizar")
        String password,
        @NotBlank(message = "El rol es obligatorio")
        @Schema(example = "CLIENTE", allowableValues = {"ADMIN", "CLIENTE"}) String rol,
        @Schema(example = "false") Boolean premium,
        @Schema(example = "true") Boolean activo) {
}
