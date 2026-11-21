package cl.canelaymiel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "estados_pedido")
@Getter
@Setter
@NoArgsConstructor
public class EstadoPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String nombre;

    // Posición en el flujo: 1 = Recibido ... 5 = Entregado.
    @Column(nullable = false, unique = true)
    private Integer orden;

    public EstadoPedido(String nombre, Integer orden) {
        this.nombre = nombre;
        this.orden = orden;
    }
}
