package cl.canelaymiel.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "estado_id", nullable = false)
    private EstadoPedido estado;

    @Column(nullable = false)
    private LocalDateTime fecha;

    // Datos de entrega del checkout. Nulos en los pedidos antiguos.
    private LocalDate fechaEntrega;

    @Column(length = 200)
    private String direccion;

    @Column(length = 20)
    private String telefono;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal descuento;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal envio;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal total;

    @ManyToOne
    @JoinColumn(name = "cupon_id")
    private Cupon cupon;

    // Si se borra el pedido se borran sus detalles.
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles = new ArrayList<>();

    public void agregarDetalle(DetallePedido detalle) {
        detalle.setPedido(this);
        this.detalles.add(detalle);
    }
}
