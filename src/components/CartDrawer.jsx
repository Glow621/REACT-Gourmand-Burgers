import { extrasPrice, money } from "../utils/helpers.js";

export default function CartDrawer({
  open,
  cart,
  products,
  extras,
  settings,
  totals,
  couponDraft,
  couponMessage,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  onUpdateExtra,
  onSetMethod,
  onSetTip,
  onCouponDraftChange,
  onApplyCoupon,
  onClearCart,
  onCheckout,
}) {
  return (
    <aside className={`drawer${open ? " open" : ""}`} aria-label="Carrito">
      <div className="drawer__overlay" onClick={onClose}></div>
      <div
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Panel del carrito"
      >
        <div className="drawer__head">
          <h3>Tu carrito</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        <div className="drawer__body">
          {Object.values(cart).length === 0 ? (
            <div className="cart-empty">Tu carrito está vacío. Agrega algo del menú 🍟</div>
          ) : (
            Object.values(cart).map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;

              const exList = extras
                .filter((ex) => item.extras?.[ex.key])
                .map((ex) => ex.label)
                .join(", ");
              const unit = product.price + extrasPrice(item.extras, extras);

              return (
                <div className="cart-item" key={item.id}>
                  <img src={product.img} alt={product.name} />
                  <div>
                    <div className="cart-item__top">
                      <div>
                        <h4>{product.name}</h4>
                        <div className="muted">
                          {exList ? `Extras: ${exList}` : "Sin extras"}
                        </div>
                      </div>
                      <button
                        className="link-danger"
                        onClick={() => onRemoveFromCart(product.id)}
                        aria-label="Eliminar"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="cart-item__bottom">
                      <div className="qty" aria-label="Cantidad en carrito">
                        <button
                          onClick={() => onAddToCart(product.id, -1)}
                          aria-label="Restar"
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => onAddToCart(product.id, 1)}
                          aria-label="Sumar"
                        >
                          +
                        </button>
                      </div>
                      <strong>{money(unit * item.qty)}</strong>
                    </div>

                    <div className="row" style={{ marginTop: 8 }}>
                      {extras.map((ex) => (
                        <label
                          className="tag"
                          style={{ cursor: "pointer" }}
                          key={`${item.id}-${ex.key}`}
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(item.extras?.[ex.key])}
                            onChange={(event) =>
                              onUpdateExtra(product.id, ex.key, event.target.checked)
                            }
                            style={{ accentColor: "var(--accent)", marginRight: 6 }}
                          />
                          {ex.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="drawer__foot">
          <div className="box">
            <div className="row between">
              <span className="muted">Método</span>
              <div className="segmented" role="tablist" aria-label="Método de entrega">
                <button
                  className={`seg${settings.method === "delivery" ? " active" : ""}`}
                  onClick={() => onSetMethod("delivery")}
                  type="button"
                >
                  Delivery
                </button>
                <button
                  className={`seg${settings.method === "pickup" ? " active" : ""}`}
                  onClick={() => onSetMethod("pickup")}
                  type="button"
                >
                  Pickup
                </button>
              </div>
            </div>

            <div className="row between" style={{ marginTop: 10 }}>
              <span className="muted">Propina</span>
              <div className="segmented" role="tablist" aria-label="Propina">
                {[0, 5, 10].map((pct) => (
                  <button
                    key={`tip-${pct}`}
                    className={`seg${Number(settings.tipPct) === pct ? " active" : ""}`}
                    onClick={() => onSetTip(pct)}
                    type="button"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="row" style={{ marginTop: 10 }}>
              <div className="coupon">
                <input
                  type="text"
                  placeholder="Cupón (GOURMAND10 / ENVIOFREE)"
                  value={couponDraft}
                  onChange={(event) => onCouponDraftChange(event.target.value)}
                />
                <button
                  className="btn"
                  onClick={() => onApplyCoupon(couponDraft)}
                  type="button"
                >
                  Aplicar
                </button>
              </div>
            </div>

            <div className="tiny muted" style={{ marginTop: 8 }}>
              {couponMessage}
            </div>
          </div>

          <div className="totals">
            <div className="row between">
              <span className="muted">Subtotal</span>
              <strong>{money(totals.subtotal)}</strong>
            </div>
            <div className="row between">
              <span className="muted">Descuento</span>
              <span>-{money(totals.discount)}</span>
            </div>
            <div className="row between">
              <span className="muted">Envío</span>
              <span>{money(totals.shipping)}</span>
            </div>
            <div className="row between">
              <span className="muted">Propina</span>
              <span>{money(totals.tip)}</span>
            </div>
            <div className="row between total">
              <span>Total</span>
              <strong>{money(totals.total)}</strong>
            </div>
          </div>

          <div className="drawer__actions">
            <button className="btn" onClick={onClearCart} type="button">
              Vaciar
            </button>
            <button className="btn primary" onClick={onCheckout} type="button">
              Pagar
            </button>
          </div>

          <p className="tiny muted">
            * Checkout: muestra un resumen, guarda “último pedido” y limpia el carrito.
          </p>
        </div>
      </div>
    </aside>
  );
}
