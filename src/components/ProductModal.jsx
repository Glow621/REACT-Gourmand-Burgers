import { money } from "../utils/helpers.js";

export default function ProductModal({
  open,
  modalState,
  product,
  price,
  extras,
  onClose,
  onToggleExtra,
  onDecQty,
  onIncQty,
  onAdd,
}) {
  return (
    <div className={`modal${open ? " open" : ""}`} aria-hidden={!open}>
      <div className="modal__overlay" onClick={onClose}></div>
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Detalle de producto"
      >
        <div className="modal__head">
          <h3>{product?.name || "Producto"}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="modal__body">
          <div className="modal__img">
            <img src={product?.img || ""} alt={product?.name || ""} />
          </div>

          <p className="muted" style={{ margin: "12px 0 0" }}>
            {product?.desc || ""}
          </p>

          <div className="row between" style={{ marginTop: 12 }}>
            <div className="rating">
              ★ {product ? product.rating.toFixed(1) : "0.0"}
            </div>
            <div className="price">{money(price || 0)}</div>
          </div>

          <div className="divider"></div>

          <h4 style={{ margin: "0 0 10px" }}>Extras</h4>
          <div className="row">
            {extras.map((extra) => (
              <label className="tag" style={{ cursor: "pointer" }} key={`modal-${extra.key}`}>
                <input
                  type="checkbox"
                  checked={Boolean(modalState.extras?.[extra.key])}
                  onChange={(event) => onToggleExtra(extra.key, event.target.checked)}
                  style={{ accentColor: "var(--accent)", marginRight: 6 }}
                />
                {extra.label} (+{money(extra.price)})
              </label>
            ))}
          </div>

          <div className="divider"></div>

          <div className="row between">
            <div className="qty" aria-label="Cantidad">
              <button onClick={onDecQty} aria-label="Restar">
                −
              </button>
              <span>{modalState.qty}</span>
              <button onClick={onIncQty} aria-label="Sumar">
                +
              </button>
            </div>

            <button className="btn primary" onClick={onAdd} type="button">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
