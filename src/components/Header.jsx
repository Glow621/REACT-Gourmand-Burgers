export default function Header({
  theme,
  cartCount,
  mobileNavOpen,
  onToggleTheme,
  onOpenCart,
  onToggleMobileNav,
  onCloseMobileNav,
}) {
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <a className="brand" href="#home" aria-label="Ir a inicio">
          <span className="brand__logo">🍔</span>
          <span className="brand__name">Gourmand Burgers</span>
        </a>

        <nav className="nav" aria-label="Navegación principal">
          <a href="#home">Home</a>
          <a href="#menu">Menú</a>
          <a href="#stores">Locales</a>
          <a href="#about">Nosotros</a>
          <a href="#contact">Contacto</a>
        </nav>

        <div className="actions">
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            title="Cambiar tema"
            aria-label="Cambiar tema"
          >
            {theme === "light" ? "☀️" : "🌙"}
          </button>
          <button
            className="icon-btn"
            onClick={onOpenCart}
            title="Abrir carrito"
            aria-label="Abrir carrito"
          >
            🛒 <span className="badge">{cartCount}</span>
          </button>
        </div>

        <button
          className="hamburger"
          onClick={onToggleMobileNav}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      <div
        className={`mobile-nav${mobileNavOpen ? " open" : ""}`}
        aria-label="Navegación móvil"
      >
        {[
          { href: "#home", label: "Home" },
          { href: "#menu", label: "Menú" },
          { href: "#stores", label: "Locales" },
          { href: "#about", label: "Nosotros" },
          { href: "#contact", label: "Contacto" },
        ].map((link) => (
          <a key={link.href} href={link.href} onClick={onCloseMobileNav}>
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
