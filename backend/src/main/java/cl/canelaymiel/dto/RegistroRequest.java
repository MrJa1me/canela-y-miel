package cl.canelaymiel.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record RegistroRequest(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido") String correo,
        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres") String password,
        // Obligatoria: de aquí salen el 50% para mayores de 50 y la torta de cumpleaños.
        @NotNull(message = "La fecha de nacimiento es obligatoria")
        @Past(message = "La fecha de nacimiento debe ser anterior a hoy") LocalDate fechaNacimiento,
        // Opcional: por ahora el único código válido es FELICES50.
        String codigoPromocional) {
}
