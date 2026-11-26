import { filtrarProductos } from "../../src/utils/filtrarProductos";
import { recomendarProductos } from "../../src/utils/recomendarProductos";

const productos = [
  { id: 1, codigo: "TC001", nombre: "Torta Cuadrada de Chocolate", categoria: "Tortas Cuadradas", precio: 45000, activo: true, stock: 8 },
  { id: 2, codigo: "PI002", nombre: "Tiramisú Clásico", categoria: "Postres Individuales", precio: 5500, activo: true, stock: 12 },
  { id: 3, codigo: "PG002", nombre: "Pan Sin Gluten", categoria: "Productos Sin Gluten", precio: 3500, activo: true, stock: 0 },
];

describe("filtrarProductos", () => {
  it("con categoría vacía deja pasar todas y filtra solo por precio", () => {
    const resultado = filtrarProductos(productos, "", 30000);

    expect(resultado.map((p) => p.id)).toEqual([2, 3]);
  });

  it("deja solo la categoría elegida", () => {
    const resultado = filtrarProductos(productos, "Tortas Cuadradas", 50000);

    expect(resultado.length).toBe(1);
    expect(resultado[0].nombre).toBe("Torta Cuadrada de Chocolate");
  });

  it("devuelve lista vacía si nada cumple", () => {
    expect(filtrarProductos(productos, "Tortas Cuadradas", 1000)).toEqual([]);
  });
});

describe("recomendarProductos", () => {
  it("pone primero las categorías favoritas y salta lo sin stock", () => {
    const resultado = recomendarProductos(productos, [], ["Postres Individuales"]);

    expect(resultado[0].id).toBe(2);
    expect(resultado.some((p) => p.id === 3)).toBeFalse();
  });

  it("no recomienda lo que el cliente ya compró", () => {
    const pedidos = [{ detalles: [{ productoId: 1 }] }];
    const resultado = recomendarProductos(productos, pedidos, []);

    expect(resultado.some((p) => p.id === 1)).toBeFalse();
  });
});
