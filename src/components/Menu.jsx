export default function Menu({
  sectionRef,
  categories,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchTermChange,
  sortMode,
  onSortModeChange,
  products,
  cart,
  favSet,
  onToggleFavorite,
  onAddToCart,
  onOpenModal,
  onQuickExtras,
}) {
  return (
    <section id="menu" className="menu" ref={sectionRef}>
      <div className="container">
        <div className="section-head">
          <h2>Gourmand’s Menu</h2>
          <p className="muted">Buscá, filtrá, elegí extras y agregá al carrito.</p>
        </div>

        <div className="controls">
          <div className="search">
            <span>🔎</span>
            <input
              type="search"
              placeholder="Buscar: bacon, veggie, combo..."
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
            />
          </div>

          <div className="chips" aria-label="Categorías">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`chip${cat === activeCategory ? " active" : ""}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sort">
            <label className="muted" htmlFor="sortSelect">
              Orden:
            </label>
            <select
              id="sortSelect"
              value={sortMode}
              onChange={(event) => onSortModeChange(event.target.value)}
            >
              <option value="featured">Destacados</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
              <option value="ratingDesc">Rating: mejor</option>
            </select>
          </div>
        </div>

        <div className="grid" aria-label="Lista de productos">
          {products.length === 0 ? (
            <div className="cart-empty">No hay resultados con esos filtros.</div>
          ) : (
            products.map((product) => {
              const inCartQty = cart[product.id]?.qty || 0;
              const isFav = favSet.has(product.id);

              return (
                <article className="card" key={product.id}>
                  <div className="card__img">
                    <img src={product.img} alt={product.name} />
                  </div>

                  <div className="card__body">
                    <div className="card__title">
                      <h3>{product.name}</h3>
                      <span className="rating">★ {product.rating.toFixed(1)}</span>
                    </div>

                    <p className="muted" style={{ margin: 0 }}>
                      {product.desc}
                    </p>

                    <div className="meta">
                      {product.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                      <span className="tag">{product.category}</span>
                      {product.featured ? <span className="tag">⭐ Destacado</span> : null}
                    </div>

                    <div className="price-row">
                      <div className="price">${product.price.toFixed(2)}</div>
                      <button
                        className="icon-btn"
                        onClick={() => onToggleFavorite(product.id)}
                        title="Favorito"
                        aria-label="Favorito"
                      >
                        {isFav ? "💛" : "❤"}
                      </button>
                    </div>

                    <div className="card__actions">
                      <div className="qty" aria-label="Cantidad">
                        <button
                          onClick={() => onAddToCart(product.id, -1)}
                          aria-label="Restar"
                        >
                          −
                        </button>
                        <span>{inCartQty}</span>
                        <button
                          onClick={() => onAddToCart(product.id, 1)}
                          aria-label="Sumar"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn primary"
                        onClick={() => onAddToCart(product.id, 1)}
                        type="button"
                      >
                        Agregar
                      </button>
                    </div>

                    <div className="card__footer">
                      <button
                        className="small-btn"
                        onClick={() => onOpenModal(product.id)}
                        type="button"
                      >
                        Ver detalles
                      </button>
                      <button
                        className="small-btn"
                        onClick={() => onQuickExtras(product.id)}
                        type="button"
                      >
                        + Extras rápido
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
