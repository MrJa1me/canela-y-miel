package cl.canelaymiel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 120)
    private String correo;

    // Siempre se guarda con BCrypt, nunca en texto plano.
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean premium;

    @Column(nullable = false)
    private boolean activo = true;

    @ManyToOne(optional = false)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    public Usuario(String nombre, String correo, String password, boolean premium, boolean activo, Rol rol) {
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
        this.premium = premium;
        this.activo = activo;
        this.rol = rol;
    }
}
