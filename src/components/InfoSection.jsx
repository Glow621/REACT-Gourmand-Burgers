export default function InfoSection() {
  return (
    <section id="about" className="info">
      <div className="container info__grid">
        <div className="card soft">
          <h3>Experiencia de compra realista</h3>
          <p className="muted">
            Extras por producto, favoritos persistentes, carrito lateral,
            cupones y métodos de entrega.
          </p>
          <ul className="list">
            <li>Modal de producto</li>
            <li>Cupón + propina</li>
            <li>Sucursal seleccionable</li>
          </ul>
        </div>
        <div className="card soft">
          <h3>Fácil de extender</h3>
          <p className="muted">
            Futura implementacion backend con checkout real, pasarela de pago,
            panel admin, inventario, login, etc.
          </p>
          <div className="row">
            <span className="tag">Leaflet</span>
            <span className="tag">Drawer</span>
            <span className="tag">Toasts</span>
            <span className="tag">Cupones</span>
            <span className="tag">Favoritos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
