package cl.canelaymiel.security;

import cl.canelaymiel.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

// Crea y valida los tokens. La clave nunca va en el código: sale de JWT_SECRET.
@Service
public class JwtService {

    private final SecretKey clave;
    private final long minutosAcceso;
    private final long diasRefresh;

    public JwtService(
            @Value("${app.jwt.secret}") String secreto,
            @Value("${app.jwt.access-minutos}") long minutosAcceso,
            @Value("${app.jwt.refresh-dias}") long diasRefresh) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.minutosAcceso = minutosAcceso;
        this.diasRefresh = diasRefresh;
    }

    public String generarAcceso(Usuario usuario) {
        Instant ahora = Instant.now();
        return Jwts.builder()
                .subject(usuario.getCorreo())
                .claim("tipo", "access")
                .claim("rol", usuario.getRol().getNombre())
                .claim("nombre", usuario.getNombre())
                .claim("id", usuario.getId())
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plus(minutosAcceso, ChronoUnit.MINUTES)))
                .signWith(clave)
                .compact();
    }

    public String generarRefresh(Usuario usuario) {
        Instant ahora = Instant.now();
        return Jwts.builder()
                .subject(usuario.getCorreo())
                .claim("tipo", "refresh")
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plus(diasRefresh, ChronoUnit.DAYS)))
                .signWith(clave)
                .compact();
    }

    // Lanza JwtException si la firma es inválida o el token venció.
    public Claims leer(String token) {
        return Jwts.parser().verifyWith(clave).build().parseSignedClaims(token).getPayload();
    }

    public boolean esAcceso(Claims claims) {
        return "access".equals(claims.get("tipo", String.class));
    }

    public boolean esRefresh(Claims claims) {
        return "refresh".equals(claims.get("tipo", String.class));
    }
}
