package cl.canelaymiel.service;

import java.time.LocalDate;
import java.time.MonthDay;
import java.time.Period;
import java.util.List;
import java.util.Locale;

// Reglas del cliente tomadas del caso: edad, cumpleaños y correo institucional.
public final class ReglasCliente {

    public static final String CODIGO_FELICES50 = "FELICES50";

    private static final List<String> DOMINIOS_INSTITUCIONALES =
            List.of("@duoc.cl", "@duocuc.cl", "@profesor.duoc.cl");

    private ReglasCliente() {
    }

    public static boolean esCorreoInstitucional(String correo) {
        if (correo == null) {
            return false;
        }
        String normalizado = correo.trim().toLowerCase(Locale.ROOT);
        return DOMINIOS_INSTITUCIONALES.stream().anyMatch(normalizado::endsWith);
    }

    public static int edad(LocalDate fechaNacimiento, LocalDate hoy) {
        if (fechaNacimiento == null) {
            return 0;
        }
        return Period.between(fechaNacimiento, hoy).getYears();
    }

    public static boolean esMayorDe50(LocalDate fechaNacimiento, LocalDate hoy) {
        return fechaNacimiento != null && edad(fechaNacimiento, hoy) >= 50;
    }

    // shortcut: el 29 de febrero no se celebra en años no bisiestos.
    public static boolean cumpleAnosHoy(LocalDate fechaNacimiento, LocalDate hoy) {
        if (fechaNacimiento == null) {
            return false;
        }
        return MonthDay.from(fechaNacimiento).equals(MonthDay.from(hoy));
    }
}
