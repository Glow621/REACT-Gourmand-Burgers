export default function Footer() {
  return (
    <section id="contact" className="footer">
      <div className="container footer__grid">
        <div>
          <div className="brand brand--footer">
            <span className="brand__logo">🍔</span>
            <span className="brand__name">Gourmand Burgers</span>
          </div>
          <p className="muted-brand">Construida en React by Mati Biondi.</p>
        </div>
        <div className="footer__cols">
          <div>
            <h4>Horarios</h4>
            <p className="muted">Lun–Dom · 12:00–23:00</p>
          </div>
          <div>
            <h4>Dirección</h4>
            <p className="muted">Av. Ejemplo 123</p>
          </div>
          <div>
            <h4>Soporte</h4>
            <p className="muted">burgers@gourmand.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
