package cl.canelaymiel.dto;

import java.time.LocalDateTime;

public record ErrorResponse(LocalDateTime fecha, int estado, String mensaje) {

    public static ErrorResponse de(int estado, String mensaje) {
        return new ErrorResponse(LocalDateTime.now(), estado, mensaje);
    }
}
