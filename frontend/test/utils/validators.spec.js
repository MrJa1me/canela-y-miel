import {
  coincidenContrasenas,
  esCampoObligatorio,
  esEmailValido,
  esTelefonoChilenoValido,
  tieneLargoMinimo,
} from "../../src/utils/validators";

describe("validators", () => {
  it("esEmailValido acepta un correo real y rechaza uno incompleto", () => {
    expect(esEmailValido("ana@correo.cl")).toBeTrue();
    expect(esEmailValido("ana@correo")).toBeFalse();
    expect(esEmailValido("ana correo.cl")).toBeFalse();
  });

  it("esTelefonoChilenoValido pide 9 dígitos que empiecen con 9", () => {
    expect(esTelefonoChilenoValido("912345678")).toBeTrue();
    expect(esTelefonoChilenoValido("812345678")).toBeFalse();
    expect(esTelefonoChilenoValido("91234567")).toBeFalse();
  });

  it("tieneLargoMinimo compara el largo del texto", () => {
    expect(tieneLargoMinimo("abcdef", 6)).toBeTrue();
    expect(tieneLargoMinimo("abc", 6)).toBeFalse();
  });

  it("coincidenContrasenas solo acepta dos textos iguales", () => {
    expect(coincidenContrasenas("clave123", "clave123")).toBeTrue();
    expect(coincidenContrasenas("clave123", "clave124")).toBeFalse();
  });

  it("esCampoObligatorio rechaza vacío y solo espacios", () => {
    expect(esCampoObligatorio("Ana")).toBeTrue();
    expect(esCampoObligatorio("")).toBeFalse();
    expect(esCampoObligatorio("   ")).toBeFalse();
  });
});
