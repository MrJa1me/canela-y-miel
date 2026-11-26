import { agruparEnFilas } from "../../src/utils/agruparEnFilas";

describe("agruparEnFilas", () => {
  it("agrupa de a tres para cada diapositiva", () => {
    expect(agruparEnFilas([1, 2, 3, 4, 5])).toEqual([[1, 2, 3], [4, 5]]);
  });

  it("respeta el tamaño indicado", () => {
    expect(agruparEnFilas([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });

  it("con una lista vacía no crea diapositivas", () => {
    expect(agruparEnFilas([])).toEqual([]);
  });
});
