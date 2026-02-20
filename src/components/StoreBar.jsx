export default function StoreBar({ selectedStore, onGoStores, onClearStore }) {
  return (
    <section className="storebar" aria-live="polite">
      <div className="container storebar__inner">
        <div className="storebar__left">
          <span className="tag">📍 Sucursal</span>
          <strong>{selectedStore ? selectedStore.name : "No seleccionada"}</strong>
          <span className="muted tiny">
            {selectedStore
              ? `${selectedStore.address} · ${selectedStore.hours}`
              : "Elegí una sucursal en el mapa."}
          </span>
        </div>
        <div className="storebar__right">
          <button className="btn" onClick={onGoStores}>
            Ver locales
          </button>
          <button className="btn" onClick={onClearStore}>
            Quitar
          </button>
        </div>
      </div>
    </section>
  );
}
