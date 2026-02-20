import { useEffect, useState } from "react";
import { CAROUSEL_SLIDES } from "../data/catalog.js";

export default function Hero({ onSurprise, onOpenFeatured }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [autoSeed, setAutoSeed] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);

  useEffect(() => {
    if (autoPaused) return undefined;
    const timer = setInterval(
      () => setSlideIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length),
      4200
    );
    return () => clearInterval(timer);
  }, [autoPaused, autoSeed]);

  const goToSlide = (index, userAction = false) => {
    setSlideIndex(
      (index + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length
    );
    if (userAction) setAutoSeed((prev) => prev + 1);
  };

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="pill">
            🔥 Promo cooked · Cupón: <strong>GOURMAND10</strong> (10% OFF)
          </p>
          <h1>
            Hamburguesas artesanales, donde la carne manda, y el sabor explota.
          </h1>
          <p className="muted">
            Proyecto construido en React: menú, favoritos, carrito persistente,
            cupones, delivery/pickup y sucursales.
          </p>

          <div className="hero__cta">
            <a className="btn primary" href="#menu">
              Ver menú
            </a>
            <button className="btn" onClick={onSurprise}>
              Sorpréndeme 🎲
            </button>
            <button className="btn" onClick={onOpenFeatured}>
              Ver destacados ⭐
            </button>
          </div>

          <div className="hero__stats">
            <div className="stat">
              <div className="stat__num">15–20 min</div>
              <div className="stat__label">Entrega promedio</div>
            </div>
            <div className="stat">
              <div className="stat__num">★ 4.8</div>
              <div className="stat__label">Valoración</div>
            </div>
            <div className="stat">
              <div className="stat__num">Delivery</div>
              <div className="stat__label">Primera compra gratis!</div>
            </div>
          </div>
        </div>

        <div className="hero__media">
          <div
            className="carousel"
            aria-label="Carrusel de destacados"
            onMouseEnter={() => setAutoPaused(true)}
            onMouseLeave={() => {
              setAutoPaused(false);
              setAutoSeed((prev) => prev + 1);
            }}
          >
            <div
              className="carousel__track"
              style={{ transform: `translateX(${-slideIndex * 100}%)` }}
            >
              {CAROUSEL_SLIDES.map((slide) => (
                <div className="slide" key={slide.title}>
                  <img src={slide.img} alt={slide.title} />
                  <div className="slide__overlay">
                    <div className="slide__title">{slide.title}</div>
                    <div className="slide__subtitle">{slide.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel__btn left"
              onClick={() => goToSlide(slideIndex - 1, true)}
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              className="carousel__btn right"
              onClick={() => goToSlide(slideIndex + 1, true)}
              aria-label="Siguiente"
            >
              ›
            </button>

            <div className="carousel__dots" aria-label="Indicadores">
              {CAROUSEL_SLIDES.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  className={`dot${i === slideIndex ? " active" : ""}`}
                  onClick={() => goToSlide(i, true)}
                  aria-label={`Ir a slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
