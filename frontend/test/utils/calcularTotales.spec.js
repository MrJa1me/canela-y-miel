import { calcularTotales } from "../../src/utils/calcularTotales";

// Productos del catálogo del caso para no repetirlos en cada prueba
const torta = { id: 1, nombre: "Torta Cuadrada de Chocolate", precio: 45000, cantidad: 1 };
const tortaBarata = { id: 2, nombre: "Torta Circular de Vainilla", precio: 40000, cantidad: 1 };
const postre = { id: 3, nombre: "Tiramisú Clásico", precio: 5500, cantidad: 2 };

describe("calcularTotales", () => {
  it("con el carrito vacío todo vale 0, incluido el envío", () => {
    const resultado = calcularTotales([], {});

    expect(resultado.subtotal).toBe(0);
    expect(resultado.envio).toBe(0);
    expect(resultado.total).toBe(0);
  });

  it("suma precio x cantidad y agrega $8.000 de envío", () => {
    // 45.000 + (5.500 x 2) = 56.000
    const resultado = calcularTotales([torta, postre], {});

    expect(resultado.subtotal).toBe(56000);
    expect(resultado.envio).toBe(8000);
    expect(resultado.total).toBe(64000);
  });

  it("al cliente Premium le descuenta el 10%", () => {
    const resultado = calcularTotales([torta], { esPremium: true });

    expect(resultado.descuento).toBe(4500);
    expect(resultado.total).toBe(48500);
  });

  it("al mayor de 50 le descuenta el 50%", () => {
    const resultado = calcularTotales([torta], { esMayorDe50: true });

    expect(resultado.descuento).toBe(22500);
    expect(resultado.total).toBe(30500);
  });

  it("con FELICES50 descuenta el 10% de por vida", () => {
    const resultado = calcularTotales([torta], { tieneFelices50: true });

    expect(resultado.descuento).toBe(4500);
  });

  it("con cupón descuenta el porcentaje del cupón", () => {
    const resultado = calcularTotales([torta], { cuponPorcentaje: 20 });

    expect(resultado.descuento).toBe(9000);
  });

  it("si cumple varios beneficios aplica solo el mayor", () => {
    const resultado = calcularTotales([torta], {
      esMayorDe50: true,
      esPremium: true,
      tieneFelices50: true,
      cuponPorcentaje: 20,
    });

    // 50% gana al 10% y al 20%; nunca se suman.
    expect(resultado.descuento).toBe(22500);
  });

  it("en su cumpleaños Duoc regala la torta más barata", () => {
    const resultado = calcularTotales([torta, tortaBarata, postre], {
      correoInstitucional: true,
      cumpleHoy: true,
    });

    // Subtotal 96.000; se regalan 40.000 y luego no hay descuento porcentual.
    expect(resultado.subtotal).toBe(96000);
    expect(resultado.descuento).toBe(40000);
    expect(resultado.total).toBe(64000);
  });

  it("la torta gratis no se aplica si no es su cumpleaños o no es correo Duoc", () => {
    expect(
      calcularTotales([torta], { correoInstitucional: true, cumpleHoy: false }).descuento
    ).toBe(0);
    expect(
      calcularTotales([torta], { correoInstitucional: false, cumpleHoy: true }).descuento
    ).toBe(0);
  });

  it("no regala la torta si es lo único del carrito", () => {
    const resultado = calcularTotales([torta], {
      correoInstitucional: true,
      cumpleHoy: true,
    });

    // Sin otro producto pagado, la torta se cobra completa.
    expect(resultado.descuento).toBe(0);
    expect(resultado.total).toBe(53000);
  });
});
