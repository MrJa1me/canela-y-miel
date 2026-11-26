import { TIENDA, urlMapa, urlMapaCompleto } from "../config/tienda";

// Mapa de la tienda con el visor público de OpenStreetMap.
function MapaTienda() {
  return (
    <div className="card">
      <iframe
        title={`Mapa de ${TIENDA.nombre}`}
        src={urlMapa()}
        className="mapa-tienda"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="card-body py-2">
        <p className="small mb-1">{TIENDA.direccion}</p>
        <p className="small text-secondary mb-1">
          {TIENDA.demostracion && "Ubicación de demostración. "}
          <a href={urlMapaCompleto()} target="_blank" rel="noreferrer">
            Abrir el mapa
          </a>
        </p>
        <p className="small text-secondary mb-0">
          Si el mapa no carga, revisa tu conexión a internet.
        </p>
      </div>
    </div>
  );
}

export default MapaTienda;
