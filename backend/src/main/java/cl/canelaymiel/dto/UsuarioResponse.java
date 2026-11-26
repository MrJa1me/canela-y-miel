package cl.canelaymiel.dto;

import cl.canelaymiel.model.Usuario;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

public record UsuarioResponse(
        Long id,
        String nombre,
        String correo,
        String telefono,
        String direccion,
        LocalDate fechaNacimiento,
        String codigoPromocional,
        boolean correoInstitucional,
        List<String> preferencias,
        String avatar,
        boolean premium,
        boolean activo,
        String rol) {

    public static UsuarioResponse desde(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getTelefono(),
                usuario.getDireccion(),
                usuario.getFechaNacimiento(),
                usuario.getCodigoPromocional(),
                Boolean.TRUE.equals(usuario.getCorreoInstitucional()),
                preferencias(usuario.getPreferencias()),
                usuario.getAvatar(),
                usuario.isPremium(),
                usuario.isActivo(),
                usuario.getRol().getNombre());
    }

    private static List<String> preferencias(String texto) {
        if (texto == null || texto.isBlank()) {
            return List.of();
        }
        return Arrays.stream(texto.split(","))
                .map(String::trim)
                .filter(valor -> !valor.isEmpty())
                .toList();
    }
}
