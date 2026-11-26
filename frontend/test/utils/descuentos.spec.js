import {
  beneficiosDeUsuario,
  calcularEdad,
  esCorreoInstitucional,
  esCumpleanosHoy,
  esMayorDe50,
  hoyISO,
} from "../../src/utils/descuentos";

// Fecha fija para no depender del día en que se ejecuten las pruebas
const hoy = new Date(2026, 10, 25); // 25 de noviembre de 2026

describe("descuentos", () => {
  it("calcula la edad en años cumplidos", () => {
    expect(calcularEdad("2000-11-25", hoy)).toBe(26);
    expect(calcularEdad("2000-11-26", hoy)).toBe(25);
    expect(calcularEdad("", hoy)).toBeNull();
  });

  it("es mayor de 50 al llegar a los 50", () => {
    expect(esMayorDe50("1976-11-25", hoy)).toBeTrue();
    expect(esMayorDe50("1976-11-26", hoy)).toBeFalse();
  });

  it("compara el cumpleaños por día y mes", () => {
    expect(esCumpleanosHoy("2000-11-25", hoy)).toBeTrue();
    expect(esCumpleanosHoy("2000-11-26", hoy)).toBeFalse();
  });

  it("reconoce solo los correos institucionales de Duoc", () => {
    expect(esCorreoInstitucional("ana@duoc.cl")).toBeTrue();
    expect(esCorreoInstitucional("ANA@DUOCUC.CL")).toBeTrue();
    expect(esCorreoInstitucional("profe@profesor.duoc.cl")).toBeTrue();
    expect(esCorreoInstitucional("ana@gmail.com")).toBeFalse();
    expect(esCorreoInstitucional("ana@fakeduoc.cl")).toBeFalse();
  });

  it("arma los beneficios del usuario desde su sesión", () => {
    const beneficios = beneficiosDeUsuario({
      premium: false,
      codigoPromocional: "FELICES50",
      fechaNacimiento: "1970-01-01",
      correoInstitucional: false,
    });

    expect(beneficios.tieneFelices50).toBeTrue();
    expect(beneficios.esMayorDe50).toBeTrue();
    expect(beneficios.esPremium).toBeFalse();
  });

  it("devuelve la fecha local en formato yyyy-mm-dd", () => {
    expect(hoyISO(hoy)).toBe("2026-11-25");
  });
});
