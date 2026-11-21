package cl.canelaymiel.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido") String correo,
        // Obligatoria al crear; opcional al actualizar.
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres") String password,
        @NotBlank(message = "El rol es obligatorio") String rol,
        Boolean premium,
        Boolean activo) {
}
