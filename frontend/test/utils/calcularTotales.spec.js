import { calcularTotales } from "../../src/utils/calcularTotales";

// Producto de ejemplo para no repetirlo en cada prueba
const torta = { id: 1, nombre: "Torta Cuadrada de Chocolate", precio: 45000, cantidad: 1 };
const tartaleta = { id: 2, nombre: "Tarta de Santiago", precio: 6000, cantidad: 2 };

describe("calcularTotales", () => {
  it("con el carrito vacío todo vale 0, incluido el envío", () => {
    const resultado = calcularTotales([], false);

    expect(resultado.subtotal).toBe(0);
    expect(resultado.envio).toBe(0);
    expect(resultado.total).toBe(0);
  });

  it("con productos suma precio x cantidad y agrega $8.000 de envío", () => {
    // 45.000 + (6.000 x 2) = 57.000, más envío 8.000
    const resultado = calcularTotales([torta, tartaleta], false);

    expect(resultado.subtotal).toBe(57000);
    expect(resultado.envio).toBe(8000);
    expect(resultado.total).toBe(65000);
  });

  it("al cliente Premium le descuenta el 10% de los productos", () => {
    const resultado = calcularTotales([torta], true);

    expect(resultado.descuento).toBe(4500);
    // 45.000 - 4.500 + 8.000
    expect(resultado.total).toBe(48500);
  });

  it("al cliente normal no le descuenta nada", () => {
    expect(calcularTotales([torta], false).descuento).toBe(0);
  });
});
