package cl.canelaymiel.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

// Pruebas de las reglas del cliente que salen del caso.
class ReglasClienteTest {

    @Test
    void calculaLaEdadEnAniosCumplidos() {
        LocalDate hoy = LocalDate.of(2026, 11, 25);

        assertEquals(50, ReglasCliente.edad(LocalDate.of(1976, 11, 25), hoy));
        assertEquals(49, ReglasCliente.edad(LocalDate.of(1976, 11, 26), hoy));
    }

    @Test
    void mayorDe50SeCumpleAlLlegarALos50() {
        LocalDate hoy = LocalDate.of(2026, 11, 25);

        assertTrue(ReglasCliente.esMayorDe50(LocalDate.of(1976, 11, 25), hoy));
        assertFalse(ReglasCliente.esMayorDe50(LocalDate.of(1976, 11, 26), hoy));
        assertFalse(ReglasCliente.esMayorDe50(null, hoy));
    }

    @Test
    void elCumpleanosSeComparaPorDiaYMes() {
        LocalDate hoy = LocalDate.of(2026, 11, 25);

        assertTrue(ReglasCliente.cumpleAnosHoy(LocalDate.of(2000, 11, 25), hoy));
        assertFalse(ReglasCliente.cumpleAnosHoy(LocalDate.of(2000, 11, 26), hoy));
        assertFalse(ReglasCliente.cumpleAnosHoy(null, hoy));
    }

    @Test
    void reconoceSoloLosCorreosInstitucionalesDeDuoc() {
        assertTrue(ReglasCliente.esCorreoInstitucional("ana@duoc.cl"));
        assertTrue(ReglasCliente.esCorreoInstitucional("ANA@DUOCUC.CL"));
        assertTrue(ReglasCliente.esCorreoInstitucional("profe@profesor.duoc.cl"));
        assertFalse(ReglasCliente.esCorreoInstitucional("ana@gmail.com"));
        assertFalse(ReglasCliente.esCorreoInstitucional("ana@fakeduoc.cl"));
        assertFalse(ReglasCliente.esCorreoInstitucional(null));
    }
}
