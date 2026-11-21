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
@Table(name = "cupones")
@Getter
@Setter
@NoArgsConstructor
public class Cupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String codigo;

    // Porcentaje de descuento sobre el saldo después del descuento Premium.
    @Column(nullable = false)
    private Integer porcentaje;

    @Column(nullable = false)
    private boolean activo = true;

    public Cupon(String codigo, Integer porcentaje, boolean activo) {
        this.codigo = codigo;
        this.porcentaje = porcentaje;
        this.activo = activo;
    }
}
