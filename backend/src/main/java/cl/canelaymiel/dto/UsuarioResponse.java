package cl.canelaymiel.dto;

import cl.canelaymiel.model.Usuario;
import java.time.LocalDate;

public record UsuarioResponse(
        Long id,
        String nombre,
        String correo,
        LocalDate fechaNacimiento,
        String codigoPromocional,
        boolean correoInstitucional,
        boolean premium,
        boolean activo,
        String rol) {

    public static UsuarioResponse desde(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getFechaNacimiento(),
                usuario.getCodigoPromocional(),
                Boolean.TRUE.equals(usuario.getCorreoInstitucional()),
                usuario.isPremium(),
                usuario.isActivo(),
                usuario.getRol().getNombre());
    }
}
