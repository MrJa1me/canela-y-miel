package cl.canelaymiel.service;

import cl.canelaymiel.dto.CambioPasswordRequest;
import cl.canelaymiel.dto.PerfilRequest;
import cl.canelaymiel.dto.UsuarioRequest;
import cl.canelaymiel.dto.UsuarioResponse;
import cl.canelaymiel.exception.ConflictoException;
import cl.canelaymiel.exception.DatosInvalidosException;
import cl.canelaymiel.exception.RecursoNoEncontradoException;
import cl.canelaymiel.model.Rol;
import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.repository.RolRepository;
import cl.canelaymiel.repository.UsuarioRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll().stream().map(UsuarioResponse::desde).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtener(Long id) {
        return UsuarioResponse.desde(buscar(id));
    }

    @Transactional
    public UsuarioResponse crear(UsuarioRequest request) {
        if (request.password() == null || request.password().isBlank()) {
            throw new DatosInvalidosException("La contraseña es obligatoria");
        }

        if (usuarioRepository.findByCorreoIgnoreCase(request.correo().trim()).isPresent()) {
            throw new ConflictoException("El correo ya está registrado");
        }

        Usuario usuario = new Usuario(
                request.nombre().trim(),
                request.correo().trim().toLowerCase(),
                passwordEncoder.encode(request.password()),
                Boolean.TRUE.equals(request.premium()),
                request.activo() == null || request.activo(),
                buscarRol(request.rol()));

        return UsuarioResponse.desde(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioRequest request) {
        Usuario usuario = buscar(id);

        usuarioRepository.findByCorreoIgnoreCase(request.correo().trim())
                .filter(otro -> !otro.getId().equals(id))
                .ifPresent(otro -> {
                    throw new ConflictoException("El correo ya está registrado");
                });

        usuario.setNombre(request.nombre().trim());
        usuario.setCorreo(request.correo().trim().toLowerCase());
        usuario.setRol(buscarRol(request.rol()));

        if (request.password() != null && !request.password().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(request.password()));
        }

        if (request.premium() != null) {
            usuario.setPremium(request.premium());
        }

        if (request.activo() != null) {
            usuario.setActivo(request.activo());
        }

        return UsuarioResponse.desde(usuario);
    }

    @Transactional
    public void eliminar(Long id) {
        usuarioRepository.delete(buscar(id));
    }

    // El dueño de la cuenta edita solo sus datos de contacto, avatar y preferencias.
    @Transactional
    public UsuarioResponse actualizarPerfil(Long id, PerfilRequest request) {
        Usuario usuario = buscar(id);

        usuario.setNombre(request.nombre().trim());
        usuario.setTelefono(limpiar(request.telefono()));
        usuario.setDireccion(limpiar(request.direccion()));

        // Se guardan como texto separado por comas; sin vacíos ni repetidos.
        usuario.setPreferencias(request.preferencias() == null || request.preferencias().isEmpty()
                ? null
                : request.preferencias().stream()
                        .filter(valor -> valor != null && !valor.isBlank())
                        .map(String::trim)
                        .distinct()
                        .collect(Collectors.joining(",")));

        String avatar = limpiar(request.avatar());
        if (avatar != null && !ReglasCliente.AVATARES.contains(avatar)) {
            throw new DatosInvalidosException("El avatar elegido no es válido");
        }
        usuario.setAvatar(avatar);

        return UsuarioResponse.desde(usuario);
    }

    @Transactional
    public void cambiarPassword(Long id, CambioPasswordRequest request) {
        Usuario usuario = buscar(id);

        if (!passwordEncoder.matches(request.actual(), usuario.getPassword())) {
            throw new DatosInvalidosException("La contraseña actual no coincide");
        }

        usuario.setPassword(passwordEncoder.encode(request.nueva()));
    }

    private String limpiar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    private Rol buscarRol(String nombre) {
        return rolRepository.findByNombre(nombre.trim().toUpperCase())
                .orElseThrow(() -> new DatosInvalidosException("El rol debe ser ADMIN o CLIENTE"));
    }
}
