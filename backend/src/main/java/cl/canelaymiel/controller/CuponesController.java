package cl.canelaymiel.controller;

import cl.canelaymiel.dto.CuponRequest;
import cl.canelaymiel.dto.CuponResponse;
import cl.canelaymiel.service.CuponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cupones")
@RequiredArgsConstructor
@Tag(name = "Cupones", description = "Códigos de descuento")
public class CuponesController {

    private final CuponService cuponService;

    @Operation(summary = "Listar cupones")
    @ApiResponse(responseCode = "200", description = "Lista de cupones")
    @GetMapping
    public List<CuponResponse> listar() {
        return cuponService.listar();
    }

    @Operation(summary = "Obtener un cupón por su id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cupón encontrado"),
            @ApiResponse(responseCode = "404", description = "Cupón no encontrado")
    })
    @GetMapping("/{id}")
    public CuponResponse obtener(@PathVariable Long id) {
        return cuponService.obtener(id);
    }

    @Operation(summary = "Validar un cupón por su código",
            description = "Público: permite mostrar el descuento antes de confirmar el pedido.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cupón válido"),
            @ApiResponse(responseCode = "400", description = "El cupón no existe o está inactivo")
    })
    @GetMapping("/validar/{codigo}")
    public CuponResponse validar(@PathVariable String codigo) {
        return cuponService.validar(codigo);
    }

    @Operation(summary = "Crear un cupón")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Cupón creado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "409", description = "El código ya existe")
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CuponResponse crear(@Valid @RequestBody CuponRequest request) {
        return cuponService.crear(request);
    }

    @Operation(summary = "Actualizar un cupón")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cupón actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Cupón no encontrado"),
            @ApiResponse(responseCode = "409", description = "El código ya existe")
    })
    @PutMapping("/{id}")
    public CuponResponse actualizar(@PathVariable Long id, @Valid @RequestBody CuponRequest request) {
        return cuponService.actualizar(id, request);
    }

    @Operation(summary = "Eliminar un cupón")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Cupón eliminado"),
            @ApiResponse(responseCode = "404", description = "Cupón no encontrado"),
            @ApiResponse(responseCode = "409", description = "El cupón tiene pedidos asociados")
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        cuponService.eliminar(id);
    }
}
