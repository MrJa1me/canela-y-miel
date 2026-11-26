package cl.canelaymiel.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record PedidoRequest(
        @NotNull(message = "El cliente es obligatorio")
        @Schema(example = "2") Long clienteId,
        // Opcional: si viene, se valida y compite como descuento.
        @Schema(example = "MIEL10", description = "Opcional; se aplica solo si es el mayor descuento")
        String cuponCodigo,
        @NotNull(message = "La fecha de entrega es obligatoria")
        @FutureOrPresent(message = "La fecha de entrega no puede ser pasada")
        @Schema(example = "2026-12-01") LocalDate fechaEntrega,
        @Size(max = 200, message = "La dirección no puede superar los 200 caracteres")
        @Schema(example = "Av. Siempre Viva 123", description = "Opcional en pedidos de mostrador")
        String direccion,
        @Pattern(regexp = "^$|^9\\d{8}$", message = "El teléfono debe tener 9 dígitos y empezar con 9")
        @Schema(example = "912345678", description = "Opcional en pedidos de mostrador")
        String telefono,
        @Schema(example = "false", description = "true para retiro en el local (sin envío)")
        Boolean retiro,
        @NotEmpty(message = "El pedido debe tener al menos un producto")
        @Valid List<DetallePedidoRequest> detalles) {
}
