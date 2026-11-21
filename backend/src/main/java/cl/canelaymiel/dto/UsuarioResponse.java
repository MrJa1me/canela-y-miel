package cl.canelaymiel.dto;

import cl.canelaymiel.model.Usuario;

public record UsuarioResponse(
        Long id,
        String nombre,
        String correo,
        boolean premium,
        boolean activo,
        String rol) {

    public static UsuarioResponse desde(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.isPremium(),
                usuario.isActivo(),
                usuario.getRol().getNombre());
    }
}
