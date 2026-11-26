package cl.canelaymiel.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cl.canelaymiel.dto.CambioPasswordRequest;
import cl.canelaymiel.dto.PerfilRequest;
import cl.canelaymiel.dto.UsuarioResponse;
import cl.canelaymiel.exception.DatosInvalidosException;
import cl.canelaymiel.model.Rol;
import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.repository.RolRepository;
import cl.canelaymiel.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

// Pruebas del perfil del dueño de la cuenta, sin base de datos.
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private RolRepository rolRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void preparar() {
        usuario = new Usuario("Ana", "ana@correo.cl", "hash", false, true, new Rol("CLIENTE"));
        usuario.setId(1L);
    }

    @Test
    void actualizaDatosYPreferenciasSinTocarLaContrasena() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        UsuarioResponse respuesta = usuarioService.actualizarPerfil(1L, new PerfilRequest(
                "Ana Pérez",
                "912345678",
                "Av. Siempre Viva 123",
                List.of("Tortas Cuadradas", "Productos Vegana", "Tortas Cuadradas"),
                "/img/avatares/avatar-2.svg"));

        assertEquals("Ana Pérez", respuesta.nombre());
        assertEquals("912345678", respuesta.telefono());
        assertEquals("Av. Siempre Viva 123", respuesta.direccion());
        assertEquals(List.of("Tortas Cuadradas", "Productos Vegana"), respuesta.preferencias());
        assertEquals("/img/avatares/avatar-2.svg", respuesta.avatar());
        assertEquals("hash", usuario.getPassword());
    }

    @Test
    void limpiaCamposVacios() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        UsuarioResponse respuesta = usuarioService.actualizarPerfil(1L, new PerfilRequest(
                "Ana", "   ", "", List.of(), null));

        assertNull(respuesta.telefono());
        assertNull(respuesta.direccion());
        assertNull(respuesta.avatar());
        assertTrue(respuesta.preferencias().isEmpty());
    }

    @Test
    void rechazaUnAvatarQueNoEstaEnLaLista() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        assertThrows(DatosInvalidosException.class, () -> usuarioService.actualizarPerfil(1L,
                new PerfilRequest("Ana", null, null, List.of(), "https://sitio-externo.cl/foto.jpg")));
    }

    @Test
    void cambiaLaContrasenaSiLaActualCoincide() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("Clave1234", "hash")).thenReturn(true);
        when(passwordEncoder.encode("Nueva1234")).thenReturn("nuevo-hash");

        usuarioService.cambiarPassword(1L, new CambioPasswordRequest("Clave1234", "Nueva1234"));

        assertEquals("nuevo-hash", usuario.getPassword());
    }

    @Test
    void rechazaLaContrasenaActualIncorrecta() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("mala", "hash")).thenReturn(false);

        assertThrows(DatosInvalidosException.class,
                () -> usuarioService.cambiarPassword(1L, new CambioPasswordRequest("mala", "Nueva1234")));

        verify(passwordEncoder, never()).encode(anyString());
        assertEquals("hash", usuario.getPassword());
    }
}
