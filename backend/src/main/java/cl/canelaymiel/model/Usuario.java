package cl.canelaymiel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
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

    private LocalDate fechaNacimiento;

    // Código con el que se registró (por ahora solo FELICES50).
    @Column(length = 30)
    private String codigoPromocional;

    // Se calcula al registrarse: sirve para la torta gratis de cumpleaños.
    private Boolean correoInstitucional;

    @Column(length = 20)
    private String telefono;

    @Column(length = 200)
    private String direccion;

    // Categorías favoritas separadas por coma. Se editan en el perfil.
    @Column(length = 500)
    private String preferencias;

    // Avatar predefinido (ruta de /img/avatares). Nulo = iniciales.
    @Column(length = 100)
    private String avatar;

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
