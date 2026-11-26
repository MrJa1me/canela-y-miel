import { AVATARES, iniciales } from "../../src/utils/avatares";

describe("avatares", () => {
  it("ofrece los 6 avatares permitidos por el backend", () => {
    expect(AVATARES.length).toBe(6);
    expect(AVATARES[0]).toBe("/img/avatares/avatar-1.svg");
  });

  it("usa las iniciales de las dos primeras palabras", () => {
    expect(iniciales("Ana Pérez")).toBe("AP");
    expect(iniciales("nicolás")).toBe("N");
    expect(iniciales("  ")).toBe("?");
    expect(iniciales(null)).toBe("?");
  });
});
