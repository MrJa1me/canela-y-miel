package cl.canelaymiel.controller;

import cl.canelaymiel.dto.AuthResponse;
import cl.canelaymiel.dto.LoginRequest;
import cl.canelaymiel.dto.RefreshRequest;
import cl.canelaymiel.dto.RegistroRequest;
import cl.canelaymiel.dto.UsuarioResponse;
import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Registro, login, refresco de token y perfil")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Registrar un cliente", description = "Crea un usuario CLIENTE y devuelve sus tokens.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuario registrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "409", description = "El correo ya está registrado")
    })
    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registro(@Valid @RequestBody RegistroRequest request) {
        return authService.registro(request);
    }

    @Operation(summary = "Iniciar sesión", description = "Valida correo y contraseña con BCrypt.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sesión iniciada"),
            @ApiResponse(responseCode = "401", description = "Correo o contraseña incorrectos")
    })
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @Operation(summary = "Renovar el token de acceso", description = "Recibe el refresh token y entrega tokens nuevos.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token renovado"),
            @ApiResponse(responseCode = "401", description = "Refresh token inválido o vencido")
    })
    @PostMapping("/refresh")
    public AuthResponse refrescar(@Valid @RequestBody RefreshRequest request) {
        return authService.refrescar(request);
    }

    @Operation(summary = "Ver el perfil autenticado")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Datos del usuario"),
            @ApiResponse(responseCode = "401", description = "Sin sesión")
    })
    @GetMapping("/perfil")
    public UsuarioResponse perfil(@AuthenticationPrincipal Usuario usuario) {
        return authService.perfil(usuario);
    }
}
