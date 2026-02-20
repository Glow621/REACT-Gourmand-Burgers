import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COUPONS, EXTRAS, PRODUCTS, STORES } from "./data/catalog.js";
import {
  extrasPrice,
  money,
  normalizeCoupon,
  safeJSONParse,
} from "./utils/helpers.js";
import Header from "./components/Header.jsx";
import StoreBar from "./components/StoreBar.jsx";
import Hero from "./components/Hero.jsx";
import Menu from "./components/Menu.jsx";
const StoresSection = lazy(() => import("./components/StoresSection.jsx"));
import InfoSection from "./components/InfoSection.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import ProductModal from "./components/ProductModal.jsx";
import Toast from "./components/Toast.jsx";

const CART_KEY = "gourmand_cart_v2";
const THEME_KEY = "gourmand_theme_v2";
const FAV_KEY = "gourmand_favs_v2";
const STORE_KEY = "gourmand_selected_store_v2";
const CHECKOUT_KEY = "gourmand_last_order_v2";
const SETTINGS_KEY = "gourmand_settings_v2";

const DEFAULT_SETTINGS = { method: "delivery", tipPct: 0, coupon: "" };

export default function App() {
  const [cart, setCart] = useState(() =>
    safeJSONParse(localStorage.getItem(CART_KEY), {})
  );
  const [favs, setFavs] = useState(() =>
    safeJSONParse(localStorage.getItem(FAV_KEY), [])
  );
  const [selectedStoreId, setSelectedStoreId] = useState(
    () => localStorage.getItem(STORE_KEY) || ""
  );
  const [settings, setSettings] = useState(() =>
    safeJSONParse(localStorage.getItem(SETTINGS_KEY), DEFAULT_SETTINGS)
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "dark"
  );
  const [couponDraft, setCouponDraft] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState("featured");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [modalState, setModalState] = useState({
    productId: "",
    qty: 1,
    extras: {},
  });
  const [modalOpen, setModalOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  const menuRef = useRef(null);
  const storesRef = useRef(null);

  const favSet = useMemo(() => new Set(favs), [favs]);

  const categories = useMemo(() => {
    const set = new Set(PRODUCTS.map((p) => p.category));
    return ["All", ...[...set].sort()];
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchTerm.trim()) {
      const t = searchTerm.trim().toLowerCase();
      list = list.filter((p) =>
        (p.name + " " + p.desc + " " + p.tags.join(" "))
          .toLowerCase()
          .includes(t)
      );
    }

    if (sortMode === "priceAsc") list.sort((a, b) => a.price - b.price);
    if (sortMode === "priceDesc") list.sort((a, b) => b.price - a.price);
    if (sortMode === "ratingDesc") list.sort((a, b) => b.rating - a.rating);
    if (sortMode === "featured") {
      list.sort((a, b) => b.featured - a.featured || b.rating - a.rating);
    }

    return list;
  }, [activeCategory, searchTerm, sortMode]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((acc, it) => acc + it.qty, 0),
    [cart]
  );

  const selectedStore = useMemo(
    () => STORES.find((s) => s.id === selectedStoreId) || null,
    [selectedStoreId]
  );

  const subtotal = useMemo(() => {
    let sum = 0;
    for (const item of Object.values(cart)) {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) continue;
      sum += (product.price + extrasPrice(item.extras, EXTRAS)) * item.qty;
    }
    return sum;
  }, [cart]);

  const discount = useMemo(() => {
    const code = normalizeCoupon(settings.coupon);
    const coupon = COUPONS[code];
    if (!coupon) return 0;
    if (coupon.type === "percent") return subtotal * (coupon.value / 100);
    return 0;
  }, [settings.coupon, subtotal]);

  const subtotalAfterDiscount = Math.max(0, subtotal - discount);

  const shipping = useMemo(() => {
    if (settings.method === "pickup") return 0;
    if (subtotalAfterDiscount <= 0) return 0;

    let base = 2.5;
    if (!selectedStoreId) base += 0.75;
    const code = normalizeCoupon(settings.coupon);
    if (code === "ENVIOFREE") base = 0;
    return base;
  }, [settings.method, settings.coupon, subtotalAfterDiscount, selectedStoreId]);

  const tip = useMemo(() => {
    const pct = Number(settings.tipPct || 0);
    return subtotalAfterDiscount * (pct / 100);
  }, [settings.tipPct, subtotalAfterDiscount]);

  const total = subtotalAfterDiscount + shipping + tip;

  const couponMessage = useMemo(() => {
    const code = normalizeCoupon(settings.coupon);
    if (!code) {
      return "Cupones demo: GOURMAND10 (10% OFF), ENVIOFREE (envío gratis).";
    }
    const coupon = COUPONS[code];
    if (!coupon) {
      return "Cupón inválido. Probá: GOURMAND10 o ENVIOFREE.";
    }
    return `Cupón aplicado: ${code} — ${coupon.label}`;
  }, [settings.coupon]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 1600);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const selectStore = useCallback(
    (storeId) => {
      setSelectedStoreId(storeId);
      localStorage.setItem(STORE_KEY, storeId);
      showToast("Sucursal seleccionada");
    },
    [showToast]
  );

  const clearStore = useCallback(() => {
    setSelectedStoreId("");
    localStorage.removeItem(STORE_KEY);
    showToast("Sucursal removida");
  }, [showToast]);

  const addToCart = useCallback(
    (id, delta, opts = {}) => {
      setCart((prev) => {
        const next = { ...prev };
        const current = next[id] || { id, qty: 0, extras: {} };
        const nextQty = current.qty + delta;

        if (nextQty <= 0) {
          delete next[id];
          if (!opts.silentToast) showToast("Eliminado del carrito");
        } else {
          next[id] = { ...current, qty: nextQty };
          if (!opts.silentToast) {
            showToast(delta > 0 ? "Agregado al carrito" : "Cantidad actualizada");
          }
        }
        return next;
      });
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (id) => {
      setCart((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      showToast("Eliminado");
    },
    [showToast]
  );

  const updateCartExtra = useCallback((productId, key, checked) => {
    setCart((prev) => {
      const next = { ...prev };
      const item = next[productId] || { id: productId, qty: 1, extras: {} };
      next[productId] = {
        ...item,
        extras: { ...item.extras, [key]: checked },
      };
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    (id) => {
      setFavs((prev) => {
        const set = new Set(prev);
        if (set.has(id)) {
          set.delete(id);
          showToast("Quitado de favoritos");
        } else {
          set.add(id);
          showToast("Guardado en favoritos");
        }
        return [...set];
      });
    },
    [showToast]
  );

  const quickExtras = useCallback(
    (id) => {
      setCart((prev) => {
        const next = { ...prev };
        const current = next[id] || { id, qty: 0, extras: {} };
        next[id] = {
          ...current,
          qty: current.qty + 1,
          extras: { ...current.extras, cheese: true, bacon: true },
        };
        return next;
      });
      showToast("Agregado con extras (queso + bacon)");
    },
    [showToast]
  );

  const openModal = useCallback((productId) => {
    setModalState({ productId, qty: 1, extras: {} });
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const modalProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === modalState.productId) || null,
    [modalState.productId]
  );

  const modalPrice = useMemo(() => {
    if (!modalProduct) return 0;
    return modalProduct.price + extrasPrice(modalState.extras, EXTRAS);
  }, [modalProduct, modalState.extras]);

  const applyCoupon = useCallback(
    (code) => {
      const normalized = normalizeCoupon(code);
      setSettings((prev) => ({ ...prev, coupon: normalized }));
      showToast(
        normalized
          ? COUPONS[normalized]
            ? "Cupón aplicado"
            : "Cupón inválido"
          : "Cupón limpiado"
      );
    },
    [showToast]
  );

  const setMethod = useCallback(
    (method) => {
      setSettings((prev) => ({ ...prev, method }));
      showToast(method === "pickup" ? "Pickup: envío $0" : "Delivery seleccionado");
    },
    [showToast]
  );

  const setTip = useCallback(
    (pct) => {
      setSettings((prev) => ({ ...prev, tipPct: pct }));
      showToast(`Propina: ${pct}%`);
    },
    [showToast]
  );

  const checkout = useCallback(() => {
    const items = Object.values(cart);
    if (items.length === 0) {
      showToast("Agrega algo primero 🙂");
      return;
    }

    const methodLabel = settings.method === "pickup" ? "Pickup" : "Delivery";
    const coupon = normalizeCoupon(settings.coupon);
    const tipPct = Number(settings.tipPct || 0);

    const lines = items
      .map((it) => {
        const product = PRODUCTS.find((p) => p.id === it.id);
        const ex = EXTRAS.filter((e) => it.extras?.[e.key])
          .map((e) => e.label)
          .join(", ");
        return `• ${product?.name ?? it.id} x${it.qty}${ex ? ` (Extras: ${ex})` : ""}`;
      })
      .join("\n");

    const summary = `Pedido demo creado\n\nSucursal: ${
      selectedStore ? selectedStore.name : "No seleccionada"
    }\nMétodo: ${methodLabel}\nCupón: ${coupon || "—"}\nPropina: ${tipPct}%\n\nItems:\n${lines}\n\nSubtotal: ${money(
      subtotal
    )}\nDescuento: -${money(discount)}\nEnvío: ${money(shipping)}\nPropina: ${money(tip)}\nTOTAL: ${money(total)}\n`;

    alert(summary);

    localStorage.setItem(
      CHECKOUT_KEY,
      JSON.stringify({
        createdAt: new Date().toISOString(),
        store: selectedStore ? selectedStore.name : null,
        method: methodLabel,
        coupon: coupon || null,
        tipPct,
        subtotal,
        discount,
        shipping,
        tip,
        total,
      })
    );

    setCart({});
    setDrawerOpen(false);
    showToast("¡Gracias! Pedido demo guardado");
  }, [
    cart,
    discount,
    selectedStore,
    settings.coupon,
    settings.method,
    settings.tipPct,
    shipping,
    showToast,
    subtotal,
    tip,
    total,
  ]);

  const openFeatured = useCallback(() => {
    setActiveCategory("All");
    setSearchTerm("");
    setSortMode("featured");
    showToast("Mostrando destacados primero ⭐");
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [showToast]);

  const surpriseMe = useCallback(() => {
    const pick = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    addToCart(pick.id, 1);
    setDrawerOpen(true);
  }, [addToCart]);

  const clearCart = useCallback(() => {
    setCart({});
    showToast("Carrito vacío");
  }, [showToast]);

  const addModalToCart = useCallback(() => {
    if (!modalState.productId) return;
    setCart((prev) => {
      const next = { ...prev };
      const current = next[modalState.productId] || {
        id: modalState.productId,
        qty: 0,
        extras: {},
      };
      next[modalState.productId] = {
        ...current,
        qty: current.qty + modalState.qty,
        extras: { ...current.extras, ...modalState.extras },
      };
      return next;
    });
    showToast("Agregado desde detalles");
    setModalOpen(false);
    setDrawerOpen(true);
  }, [modalState, showToast]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  }, [favs]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.body.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    setCouponDraft(settings.coupon || "");
  }, [settings.coupon]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Header
        theme={theme}
        cartCount={cartCount}
        mobileNavOpen={mobileNavOpen}
        onToggleTheme={toggleTheme}
        onOpenCart={() => setDrawerOpen(true)}
        onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
        onCloseMobileNav={() => setMobileNavOpen(false)}
      />

      <StoreBar
        selectedStore={selectedStore}
        onGoStores={() => storesRef.current?.scrollIntoView({ behavior: "smooth" })}
        onClearStore={clearStore}
      />

      <main id="home">
        <Hero onSurprise={surpriseMe} onOpenFeatured={openFeatured} />

        <Menu
          sectionRef={menuRef}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          sortMode={sortMode}
          onSortModeChange={setSortMode}
          products={filteredProducts}
          cart={cart}
          favSet={favSet}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
          onOpenModal={openModal}
          onQuickExtras={quickExtras}
        />

        <Suspense
          fallback={
            <section id="stores" className="stores" ref={storesRef}>
              <div className="container">
                <div className="section-head">
                  <h2>Locales</h2>
                  <p className="muted">Cargando mapa...</p>
                </div>
                <div className="card soft">Preparando el mapa de sucursales.</div>
              </div>
            </section>
          }
        >
          <StoresSection
            storesRef={storesRef}
            selectedStoreId={selectedStoreId}
            onSelectStore={selectStore}
            onToast={showToast}
          />
        </Suspense>

        <InfoSection />
        <Footer />
      </main>

      <button
        className="fab"
        onClick={() => setDrawerOpen(true)}
        aria-label="Abrir carrito"
      >
        🛒 <span className="badge">{cartCount}</span>
      </button>

      <CartDrawer
        open={drawerOpen}
        cart={cart}
        products={PRODUCTS}
        extras={EXTRAS}
        settings={settings}
        totals={{ subtotal, discount, shipping, tip, total }}
        couponDraft={couponDraft}
        couponMessage={couponMessage}
        onClose={() => setDrawerOpen(false)}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onUpdateExtra={updateCartExtra}
        onSetMethod={setMethod}
        onSetTip={setTip}
        onCouponDraftChange={setCouponDraft}
        onApplyCoupon={applyCoupon}
        onClearCart={clearCart}
        onCheckout={checkout}
      />

      <ProductModal
        open={modalOpen}
        modalState={modalState}
        product={modalProduct}
        price={modalPrice}
        extras={EXTRAS}
        onClose={closeModal}
        onToggleExtra={(key, checked) =>
          setModalState((prev) => ({
            ...prev,
            extras: { ...prev.extras, [key]: checked },
          }))
        }
        onDecQty={() =>
          setModalState((prev) => ({ ...prev, qty: Math.max(1, prev.qty - 1) }))
        }
        onIncQty={() =>
          setModalState((prev) => ({ ...prev, qty: prev.qty + 1 }))
        }
        onAdd={addModalToCart}
      />

      <Toast message={toastMsg} visible={toastVisible} />
    </>
  );
}
