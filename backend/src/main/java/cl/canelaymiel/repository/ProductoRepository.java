package cl.canelaymiel.repository;

import cl.canelaymiel.model.Producto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByCategoriaId(Long categoriaId);

    Optional<Producto> findByCodigoIgnoreCase(String codigo);
}
