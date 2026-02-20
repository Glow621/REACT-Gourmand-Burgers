import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { STORES } from "../data/catalog.js";
import { slug } from "../utils/helpers.js";

const DEFAULT_MAP_VIEW = { center: [-34.6037, -58.3816], zoom: 11 };

export default function StoresSection({
  storesRef,
  selectedStoreId,
  onSelectStore,
  onToast,
}) {
  const mapRef = useRef(null);
  const mapElRef = useRef(null);
  const userMarkerRef = useRef(null);
  const selectStoreRef = useRef(onSelectStore);

  useEffect(() => {
    selectStoreRef.current = onSelectStore;
  }, [onSelectStore]);

  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    const map = L.map(mapElRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(DEFAULT_MAP_VIEW.center, DEFAULT_MAP_VIEW.zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    const storesLayer = L.layerGroup().addTo(map);

    STORES.forEach((store) => {
      const popupHTML = `
        <div style="min-width:220px">
          <strong>${store.name}</strong><br>
          <span>${store.address}</span><br>
          <span><strong>Horario:</strong> ${store.hours}</span><br><br>
          <button id="pick-${slug(store.id)}" style="
            border:1px solid rgba(0,0,0,.15);
            background: linear-gradient(180deg, #f0b429, #ffcc4d);
            color:#111;
            font-weight:800;
            padding:8px 10px;
            border-radius:12px;
            cursor:pointer;
            width:100%;
          ">Seleccionar sucursal</button>
        </div>
      `;

      const marker = L.marker(store.coords).addTo(storesLayer);
      marker.bindPopup(popupHTML);
      marker.on("popupopen", () => {
        const btn = document.getElementById(`pick-${slug(store.id)}`);
        if (btn) {
          btn.onclick = () => selectStoreRef.current?.(store.id);
        }
      });
    });

    mapRef.current = map;
  }, []);

  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      onToast("Tu navegador no soporta geolocalización");
      return;
    }
    onToast("Buscando tu ubicación...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        if (userMarkerRef.current && mapRef.current) {
          mapRef.current.removeLayer(userMarkerRef.current);
        }
        if (mapRef.current) {
          userMarkerRef.current = L.marker(coords)
            .addTo(mapRef.current)
            .bindPopup("📍 Estás acá")
            .openPopup();
          mapRef.current.setView(coords, 14);
        }
        onToast("Ubicación encontrada");
      },
      () => onToast("No se pudo obtener tu ubicación"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [onToast]);

  const resetMap = useCallback(() => {
    if (!mapRef.current) return;
    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
    mapRef.current.setView(DEFAULT_MAP_VIEW.center, DEFAULT_MAP_VIEW.zoom);
    onToast("Mapa reseteado");
  }, [onToast]);

  const zoomStore = useCallback(
    (storeId) => {
      const store = STORES.find((s) => s.id === storeId);
      if (!store || !mapRef.current) return;
      mapRef.current.setView(store.coords, 14);
      onToast("Mostrando sucursal en el mapa");
    },
    [onToast]
  );

  return (
    <section id="stores" className="stores" ref={storesRef}>
      <div className="container">
        <div className="section-head">
          <h2>Locales</h2>
          <p className="muted">Ubicaciones locales.</p>
        </div>

        <div className="stores__grid">
          <div className="card soft">
            <h3>Elegí tu sucursal</h3>
            <p className="muted" style={{ marginTop: 3 }}>
              Click en un marcador para ver detalles.
            </p>

            <div className="row" style={{ marginTop: 6 }}>
              <button className="btn" onClick={locateUser}>
                📍 Mi ubicación
              </button>
              <button className="btn" onClick={resetMap}>
                ↺ Reset
              </button>
            </div>

            <div className="divider"></div>

            <h4 style={{ margin: "0 0 8px" }}>Sucursales</h4>
            <div className="storelist" aria-label="Lista de locales">
              {STORES.map((store) => {
                const isSelected = store.id === selectedStoreId;
                return (
                  <div className="storeitem" key={store.id}>
                    <strong>{store.name}</strong>
                    <div className="tiny muted">{store.address}</div>
                    <div className="tiny muted">
                      <strong>Horario:</strong> {store.hours}
                    </div>
                    <div className="row">
                      <button
                        className="btn"
                        onClick={() => zoomStore(store.id)}
                        type="button"
                      >
                        Ver en mapa
                      </button>
                      <button
                        className={`btn${isSelected ? " primary" : ""}`}
                        onClick={() => onSelectStore(store.id)}
                        type="button"
                      >
                        {isSelected ? "Seleccionada" : "Seleccionar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="tiny muted" style={{ marginTop: 10 }}>
              * “Mi ubicación” usa geolocalización del navegador (si das permiso).
            </p>
          </div>

          <div className="map-wrap card">
            <div
              ref={mapElRef}
              className="map"
              aria-label="Mapa de locales"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
