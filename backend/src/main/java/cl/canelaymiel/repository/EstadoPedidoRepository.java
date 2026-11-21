package cl.canelaymiel.repository;

import cl.canelaymiel.model.EstadoPedido;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstadoPedidoRepository extends JpaRepository<EstadoPedido, Long> {

    Optional<EstadoPedido> findByNombreIgnoreCase(String nombre);

    Optional<EstadoPedido> findByOrden(Integer orden);
}
