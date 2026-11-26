package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record RegistroRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Schema(example = "Ana Pérez") String nombre,
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no es válido")
        @Schema(example = "ana@duoc.cl", description = "Con @duoc.cl recibe la torta de cumpleaños") String correo,
        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        @Schema(example = "Clave1234") String password,
        @NotNull(message = "La fecha de nacimiento es obligatoria")
        @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
        @Schema(example = "2000-05-20", description = "De aquí salen el 50% y la torta de cumpleaños")
        LocalDate fechaNacimiento,
        @Schema(example = "FELICES50", description = "Opcional; el único código válido es FELICES50")
        String codigoPromocional) {
}
