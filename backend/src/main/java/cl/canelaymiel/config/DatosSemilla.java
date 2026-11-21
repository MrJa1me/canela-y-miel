package cl.canelaymiel.config;

import cl.canelaymiel.model.Categoria;
import cl.canelaymiel.model.Cupon;
import cl.canelaymiel.model.EstadoPedido;
import cl.canelaymiel.model.Producto;
import cl.canelaymiel.model.Rol;
import cl.canelaymiel.model.Usuario;
import cl.canelaymiel.repository.CategoriaRepository;
import cl.canelaymiel.repository.CuponRepository;
import cl.canelaymiel.repository.EstadoPedidoRepository;
import cl.canelaymiel.repository.ProductoRepository;
import cl.canelaymiel.repository.RolRepository;
import cl.canelaymiel.repository.UsuarioRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

// Datos de prueba que se crean una sola vez al arrancar la aplicación.
@Component
@RequiredArgsConstructor
public class DatosSemilla implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final EstadoPedidoRepository estadoPedidoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CuponRepository cuponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Si ya hay roles, la base ya fue sembrada.
        if (rolRepository.count() > 0) {
            return;
        }

        Rol admin = rolRepository.save(new Rol("ADMIN"));
        Rol cliente = rolRepository.save(new Rol("CLIENTE"));

        estadoPedidoRepository.save(new EstadoPedido("Recibido", 1));
        estadoPedidoRepository.save(new EstadoPedido("En preparación", 2));
        estadoPedidoRepository.save(new EstadoPedido("Listo para despacho", 3));
        estadoPedidoRepository.save(new EstadoPedido("En camino", 4));
        estadoPedidoRepository.save(new EstadoPedido("Entregado", 5));

        Categoria tortas = categoriaRepository.save(new Categoria("Tortas"));
        Categoria postres = categoriaRepository.save(new Categoria("Postres"));
        Categoria sinGluten = categoriaRepository.save(new Categoria("Sin gluten"));

        productoRepository.save(new Producto("Torta de Chocolate Clásica", new BigDecimal("35000"), 8, "/img/chocolate.jpg", tortas, true));
        productoRepository.save(new Producto("Tartaleta de Frutos Rojos", new BigDecimal("28000"), 12, "/img/tartaleta.jpg", postres, true));
        productoRepository.save(new Producto("Pancakes Sin Gluten", new BigDecimal("22000"), 15, "/img/pancakes.png", sinGluten, true));
        productoRepository.save(new Producto("Cheesecake de Frutos Rojos", new BigDecimal("30000"), 6, "/img/cheesecake.jpg", postres, true));
        productoRepository.save(new Producto("Tres Leches Clásica", new BigDecimal("32000"), 10, "/img/tres_leches.jpg", tortas, true));
        productoRepository.save(new Producto("Pastel de Zanahoria", new BigDecimal("26000"), 4, "/img/zanahoria.jpg", tortas, true));
        productoRepository.save(new Producto("Caja de Macarons Variados (12 uds)", new BigDecimal("42000"), 9, "/img/macarons.jpg", postres, true));

        // Contraseñas de prueba: Admin1234 y Cliente1234 (ver README).
        usuarioRepository.save(new Usuario("Administrador", "admin@canelaymiel.cl", passwordEncoder.encode("Admin1234"), false, true, admin));
        usuarioRepository.save(new Usuario("Cliente Demo", "cliente@canelaymiel.cl", passwordEncoder.encode("Cliente1234"), true, true, cliente));

        cuponRepository.save(new Cupon("MIEL10", 10, true));
        cuponRepository.save(new Cupon("CANELA20", 20, false));
    }
}
