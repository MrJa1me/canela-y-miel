import { filtrarProductos } from "../../src/utils/filtrarProductos";
import { recomendarProductos } from "../../src/utils/recomendarProductos";

const productos = [
  { id: 1, codigo: "TC001", nombre: "Torta Cuadrada de Chocolate", categoria: "Tortas Cuadradas", precio: 45000, porciones: 20, activo: true, stock: 8 },
  { id: 2, codigo: "PI002", nombre: "Tiramisú Clásico", categoria: "Postres Individuales", precio: 5500, porciones: 1, activo: true, stock: 12 },
  { id: 3, codigo: "PG002", nombre: "Pan Sin Gluten", categoria: "Productos Sin Gluten", precio: 3500, porciones: 8, activo: true, stock: 0 },
];

describe("filtrarProductos", () => {
  it("sin filtros deja pasar todos", () => {
    expect(filtrarProductos(productos).length).toBe(3);
  });

  it("filtra solo por precio", () => {
    const resultado = filtrarProductos(productos, { precioMax: 30000 });

    expect(resultado.map((p) => p.id)).toEqual([2, 3]);
  });

  it("deja solo la categoría elegida", () => {
    const resultado = filtrarProductos(productos, { categoria: "Tortas Cuadradas" });

    expect(resultado.length).toBe(1);
    expect(resultado[0].nombre).toBe("Torta Cuadrada de Chocolate");
  });

  it("filtra por tamaño máximo en porciones", () => {
    const resultado = filtrarProductos(productos, { porcionesMax: 8 });

    expect(resultado.map((p) => p.id)).toEqual([2, 3]);
  });

  it("busca por nombre sin distinguir mayúsculas", () => {
    expect(filtrarProductos(productos, { busqueda: "tiramisú" }).map((p) => p.id)).toEqual([2]);
    expect(filtrarProductos(productos, { busqueda: "TORTA" }).map((p) => p.id)).toEqual([1]);
  });

  it("busca por código del catálogo", () => {
    expect(filtrarProductos(productos, { busqueda: "pg002" }).map((p) => p.id)).toEqual([3]);
  });

  it("combina categoría, precio y búsqueda", () => {
    const resultado = filtrarProductos(productos, {
      categoria: "Postres Individuales",
      precioMax: 10000,
      busqueda: "clásico",
    });

    expect(resultado.map((p) => p.id)).toEqual([2]);
  });

  it("devuelve lista vacía si nada cumple", () => {
    expect(filtrarProductos(productos, { categoria: "Tortas Cuadradas", precioMax: 1000 })).toEqual([]);
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
