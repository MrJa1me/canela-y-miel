import { formatPrice } from "../../src/utils/formatPrice";

describe("formatPrice", () => {
  it("pone el signo $ y el punto de miles", () => {
    expect(formatPrice(35000)).toBe("$35.000");
  });

  it("formatea el cero", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("formatea precios de seis cifras", () => {
    expect(formatPrice(125000)).toBe("$125.000");
  });
});
