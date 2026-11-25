import { calcularTotales } from "../../src/utils/calcularTotales";

// Producto de ejemplo para no repetirlo en cada prueba
const torta = { id: 1, nombre: "Torta de Chocolate Clásica", precio: 35000, cantidad: 1 };
const tartaleta = { id: 2, nombre: "Tartaleta de Frutos Rojos", precio: 28000, cantidad: 2 };

describe("calcularTotales", () => {
  it("con el carrito vacío todo vale 0, incluido el envío", () => {
    const resultado = calcularTotales([], false);

    expect(resultado.subtotal).toBe(0);
    expect(resultado.envio).toBe(0);
    expect(resultado.total).toBe(0);
  });

  it("con productos suma precio x cantidad y agrega $8.000 de envío", () => {
    // 35.000 + (28.000 x 2) = 91.000, más envío 8.000
    const resultado = calcularTotales([torta, tartaleta], false);

    expect(resultado.subtotal).toBe(91000);
    expect(resultado.envio).toBe(8000);
    expect(resultado.total).toBe(99000);
  });

  it("al cliente Premium le descuenta el 10% de los productos", () => {
    const resultado = calcularTotales([torta], true);

    expect(resultado.descuento).toBe(3500);
    // 35.000 - 3.500 + 8.000
    expect(resultado.total).toBe(39500);
  });

  it("al cliente normal no le descuenta nada", () => {
    expect(calcularTotales([torta], false).descuento).toBe(0);
  });
});
