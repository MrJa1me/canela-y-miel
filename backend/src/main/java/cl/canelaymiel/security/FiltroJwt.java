package cl.canelaymiel.security;

import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// Lee el header "Authorization: Bearer <token>" y autentica la petición.
@Component
@RequiredArgsConstructor
public class FiltroJwt extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String encabezado = request.getHeader("Authorization");

        if (encabezado != null && encabezado.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.leer(encabezado.substring(7));

                if (jwtService.esAcceso(claims)) {
                    usuarioRepository.findByCorreoIgnoreCase(claims.getSubject())
                            .filter(Usuario::isActivo)
                            .ifPresent(this::autenticar);
                }
            } catch (JwtException | IllegalArgumentException ex) {
                // Token inválido o vencido: la petición sigue sin autenticación.
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(request, response);
    }

    private void autenticar(Usuario usuario) {
        var autoridades = List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre()));
        var autenticacion = new UsernamePasswordAuthenticationToken(usuario, null, autoridades);
        SecurityContextHolder.getContext().setAuthentication(autenticacion);
    }
}
