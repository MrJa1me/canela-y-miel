package cl.canelaymiel.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import cl.canelaymiel.model.Rol;
import cl.canelaymiel.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

// Pruebas de generación y validación de tokens, sin Spring ni base de datos.
class JwtServiceTest {

    private static final String CLAVE = "clave-de-prueba-suficientemente-larga-para-hs256-2026";

    private JwtService jwtService;
    private Usuario usuario;

    @BeforeEach
    void preparar() {
        jwtService = new JwtService(CLAVE, 15, 7);
        usuario = new Usuario("Administrador", "admin@canelaymiel.cl", "x", false, true, new Rol("ADMIN"));
        usuario.setId(1L);
    }

    @Test
    void elAccesoLlevaElRolYElTipo() {
        Claims claims = jwtService.leer(jwtService.generarAcceso(usuario));

        assertEquals("access", claims.get("tipo", String.class));
        assertEquals("ADMIN", claims.get("rol", String.class));
        assertEquals("admin@canelaymiel.cl", claims.getSubject());
        assertTrue(jwtService.esAcceso(claims));
        assertFalse(jwtService.esRefresh(claims));
    }

    @Test
    void elRefreshNoSirveComoAcceso() {
        Claims claims = jwtService.leer(jwtService.generarRefresh(usuario));

        assertTrue(jwtService.esRefresh(claims));
        assertFalse(jwtService.esAcceso(claims));
    }

    @Test
    void rechazaUnTokenFirmadoConOtraClave() {
        JwtService otro = new JwtService("otra-clave-de-prueba-suficientemente-larga-2026", 15, 7);
        String tokenAjeno = otro.generarAcceso(usuario);

        assertThrows(JwtException.class, () -> jwtService.leer(tokenAjeno));
    }
}
