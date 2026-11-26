package cl.canelaymiel.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record PedidoRequest(
        @NotNull(message = "El cliente es obligatorio") Long clienteId,
        // Opcional: si viene, se valida y compite como descuento.
        String cuponCodigo,
        @NotNull(message = "La fecha de entrega es obligatoria")
        @FutureOrPresent(message = "La fecha de entrega no puede ser pasada") LocalDate fechaEntrega,
        @NotBlank(message = "La dirección es obligatoria")
        @Size(min = 5, max = 200, message = "Escribe la dirección completa") String direccion,
        @NotBlank(message = "El teléfono es obligatorio")
        @Pattern(regexp = "^9\\d{8}$", message = "El teléfono debe tener 9 dígitos y empezar con 9") String telefono,
        @NotEmpty(message = "El pedido debe tener al menos un producto")
        @Valid List<DetallePedidoRequest> detalles) {
}
