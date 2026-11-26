package cl.canelaymiel.service;

import cl.canelaymiel.dto.AuthResponse;
import cl.canelaymiel.dto.LoginRequest;
import cl.canelaymiel.dto.RefreshRequest;
import cl.canelaymiel.dto.RegistroRequest;
import cl.canelaymiel.dto.UsuarioResponse;
import cl.canelaymiel.exception.ConflictoException;
import cl.canelaymiel.exception.DatosInvalidosException;
import cl.canelaymiel.exception.NoAutorizadoException;
import cl.canelaymiel.model.Rol;
import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.repository.RolRepository;
import cl.canelaymiel.repository.UsuarioRepository;
import cl.canelaymiel.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse registro(RegistroRequest request) {
        String correo = request.correo().trim().toLowerCase();
        if (usuarioRepository.findByCorreoIgnoreCase(correo).isPresent()) {
            throw new ConflictoException("El correo ya está registrado");
        }

        Rol rolCliente = rolRepository.findByNombre("CLIENTE")
                .orElseThrow(() -> new DatosInvalidosException("El rol CLIENTE no existe"));

        Usuario usuario = new Usuario(
                request.nombre().trim(),
                correo,
                passwordEncoder.encode(request.password()),
                false,
                true,
                rolCliente);

        usuario.setFechaNacimiento(request.fechaNacimiento());
        usuario.setCodigoPromocional(normalizarCodigo(request.codigoPromocional()));
        usuario.setCorreoInstitucional(ReglasCliente.esCorreoInstitucional(correo));

        usuarioRepository.save(usuario);
        return respuesta(usuario);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(request.correo().trim())
                .orElseThrow(() -> new NoAutorizadoException("Correo o contraseña incorrectos"));

        if (!usuario.isActivo() || !passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new NoAutorizadoException("Correo o contraseña incorrectos");
        }

        return respuesta(usuario);
    }

    @Transactional(readOnly = true)
    public AuthResponse refrescar(RefreshRequest request) {
        try {
            Claims claims = jwtService.leer(request.refreshToken());

            if (!jwtService.esRefresh(claims)) {
                throw new NoAutorizadoException("El token no es de refresco");
            }

            Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(claims.getSubject())
                    .filter(Usuario::isActivo)
                    .orElseThrow(() -> new NoAutorizadoException("La sesión ya no es válida"));

            return respuesta(usuario);
        } catch (JwtException | IllegalArgumentException ex) {
            throw new NoAutorizadoException("El token de refresco no es válido");
        }
    }

    public UsuarioResponse perfil(Usuario usuario) {
        return UsuarioResponse.desde(usuario);
    }

    private AuthResponse respuesta(Usuario usuario) {
        return new AuthResponse(
                jwtService.generarAcceso(usuario),
                jwtService.generarRefresh(usuario),
                UsuarioResponse.desde(usuario));
    }

    // Solo se acepta el código del caso; cualquier otro es un error de tipeo del cliente.
    private String normalizarCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return null;
        }

        String normalizado = codigo.trim().toUpperCase();
        if (!ReglasCliente.CODIGO_FELICES50.equals(normalizado)) {
            throw new DatosInvalidosException("El código promocional no es válido");
        }

        return normalizado;
    }
}
