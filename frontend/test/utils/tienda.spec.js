import { TIENDA, urlMapa, urlMapaCompleto } from "../../src/config/tienda";

describe("configuración de la tienda", () => {
  it("arma el visor de OpenStreetMap con el marcador", () => {
    const url = urlMapa();

    expect(url).toContain("openstreetmap.org/export/embed.html");
    expect(url).toContain("layer=mapnik");
    expect(url).toContain(`marker=${TIENDA.latitud}%2C${TIENDA.longitud}`);
  });

  it("entrega un enlace para abrir el mapa completo", () => {
    expect(urlMapaCompleto()).toContain(`mlat=${TIENDA.latitud}`);
    expect(urlMapaCompleto()).toContain(`mlon=${TIENDA.longitud}`);
  });
});
