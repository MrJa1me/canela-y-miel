package cl.canelaymiel.dto;

public record AuthResponse(String token, String refreshToken, UsuarioResponse usuario) {
}
