package cl.canelaymiel.controller;

import cl.canelaymiel.dto.CambioEstadoRequest;
import cl.canelaymiel.dto.PedidoRequest;
import cl.canelaymiel.dto.PedidoResponse;
import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "Pedidos y su flujo de estados")
public class PedidosController {

    private final PedidoService pedidoService;

    @Operation(summary = "Listar pedidos")
    @ApiResponse(responseCode = "200", description = "Lista de pedidos")
    @GetMapping
    public List<PedidoResponse> listar(@AuthenticationPrincipal Usuario usuario) {
        return pedidoService.listar(usuario);
    }

    @Operation(summary = "Obtener un pedido por su id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido encontrado"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    @GetMapping("/{id}")
    public PedidoResponse obtener(@PathVariable Long id, @AuthenticationPrincipal Usuario usuario) {
        return pedidoService.obtener(id, usuario);
    }

    @Operation(summary = "Crear un pedido",
            description = "Calcula subtotal, descuento Premium, cupón y envío, y descuenta el stock.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Pedido creado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o cupón inválido"),
            @ApiResponse(responseCode = "404", description = "Cliente o producto no encontrado"),
            @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse crear(@Valid @RequestBody PedidoRequest request, @AuthenticationPrincipal Usuario usuario) {
        return pedidoService.crear(request, usuario);
    }

    @Operation(summary = "Cambiar el estado de un pedido",
            description = "Solo permite avanzar al estado siguiente del flujo.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado"),
            @ApiResponse(responseCode = "409", description = "El estado no sigue el orden del flujo")
    })
    @PatchMapping("/{id}/estado")
    public PedidoResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambioEstadoRequest request) {
        return pedidoService.cambiarEstado(id, request);
    }

    @Operation(summary = "Eliminar un pedido", description = "Devuelve el stock de sus productos.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Pedido eliminado"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        pedidoService.eliminar(id);
    }
}
