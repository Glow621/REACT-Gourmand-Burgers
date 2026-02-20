// ===============================
// Gourmand Burgers — Demo JS
// ===============================

// ---------- Helpers ----------
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => `$${n.toFixed(2)}`;

function toast(msg) {
  const el = qs("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 1600);
}

function slug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeJSONParse(v, fallback) {
  try {
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

// ---------- Data ----------
const EXTRAS = [
  { key: "cheese", label: "Extra queso", price: 0.8 },
  { key: "bacon", label: "Bacon", price: 1.2 },
  { key: "sauce", label: "Salsa especial", price: 0.5 },
];

const products = [
  {
    id: "classic",
    name: "Classic Burger",
    desc: "Carne, cheddar, lechuga y tomate.",
    price: 6.99,
    rating: 4.7,
    category: "Burgers",
    tags: ["Popular", "Clásica"],
    featured: true,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "bbq-bacon",
    name: "BBQ Bacon Burger",
    desc: "Bacon crujiente, cheddar y salsa BBQ.",
    price: 8.99,
    rating: 4.9,
    category: "Burgers",
    tags: ["Top", "BBQ"],
    featured: true,
    img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "veggie",
    name: "Vegetarian Delight",
    desc: "Medallón veggie, rúcula y salsa especial.",
    price: 7.99,
    rating: 4.6,
    category: "Veggie",
    tags: ["Veggie"],
    featured: true,
    img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "chicken",
    name: "Crispy Chicken",
    desc: "Pollo crispy, coleslaw y mayo limón.",
    price: 7.49,
    rating: 4.5,
    category: "Chicken",
    tags: ["Crocante"],
    featured: false,
    img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "fries",
    name: "Papas Gourmand",
    desc: "Papas rústicas con sal ahumada.",
    price: 3.49,
    rating: 4.4,
    category: "Sides",
    tags: ["Side"],
    featured: false,
    img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "onion-rings",
    name: "Onion Rings",
    desc: "Aros de cebolla dorados con dip.",
    price: 3.99,
    rating: 4.3,
    category: "Sides",
    tags: ["Side"],
    featured: false,
    img: "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "cola",
    name: "Pepsi Fría",
    desc: "330ml, bien helada.",
    price: 1.99,
    rating: 4.2,
    category: "Drinks",
    tags: ["Bebida"],
    featured: false,
    img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "milkshake",
    name: "Milkshake Vainilla",
    desc: "Cremoso, con topping crocante.",
    price: 4.99,
    rating: 4.8,
    category: "Dessert",
    tags: ["Dulce"],
    featured: false,
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1400&q=70",
  },
];

const carouselSlides = [
  {
    title: "BBQ Bacon Burger",
    subtitle: "Nuestro #1 · con bacon crujiente",
    img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=70",
  },
  {
    title: "Combo Clásico",
    subtitle: "Burger + papas + bebida",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=70",
  },
  {
    title: "Veggie Delight",
    subtitle: "Súper fresca · opción veggie",
    img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1600&q=70",
  },
];

// --- Stores (ficticias) ---
const stores = [
  {
    id: "centro",
    name: "Gourmand Centro",
    address: "Av. Demo 123, Centro",
    hours: "12:00–23:00",
    coords: [-34.6037, -58.3816],
  },
  {
    id: "norte",
    name: "Gourmand Norte",
    address: "Calle Sabores 45, Zona Norte",
    hours: "12:00–00:00",
    coords: [-34.542, -58.711],
  },
  {
    id: "palermo",
    name: "Gourmand Palermo",
    address: "Bulevar Burger 888, Palermo",
    hours: "18:00–02:00",
    coords: [-34.5875, -58.43],
  },
  {
    id: "sur",
    name: "Gourmand Sur",
    address: "Ruta 9 km 10, Sur",
    hours: "12:00–23:00",
    coords: [-34.705, -58.28],
  },
];

// ---------- Storage keys ----------
const CART_KEY = "gourmand_cart_v2";
const THEME_KEY = "gourmand_theme_v2";
const FAV_KEY = "gourmand_favs_v2";
const STORE_KEY = "gourmand_selected_store_v2";
const CHECKOUT_KEY = "gourmand_last_order_v2";
const SETTINGS_KEY = "gourmand_settings_v2"; // delivery/pickup, tip, coupon

// ---------- State ----------
let cart = safeJSONParse(localStorage.getItem(CART_KEY), {}); // { [id]: {id, qty, extras:{...}} }
let favs = new Set(safeJSONParse(localStorage.getItem(FAV_KEY), []));
let selectedStoreId = localStorage.getItem(STORE_KEY) || "";
let activeCategory = "All";
let searchTerm = "";
let sortMode = "featured";

// settings
let settings = safeJSONParse(localStorage.getItem(SETTINGS_KEY), {
  method: "delivery", // delivery | pickup
  tipPct: 0, // 0/5/10
  coupon: "", // code
});

// coupons demo
const COUPONS = {
  GOURMAND10: { type: "percent", value: 10, label: "10% OFF en subtotal" },
  ENVIOFREE: {
    type: "shipping",
    value: 100,
    label: "Envío gratis (solo delivery)",
  },
};

// ---------- DOM refs ----------
const menuGrid = qs("#menuGrid");
const chipsWrap = qs("#categoryChips");
const searchInput = qs("#searchInput");
const sortSelect = qs("#sortSelect");

const cartCountEl = qs("#cartCount");
const cartCountFabEl = qs("#cartCountFab");
const cartDrawer = qs("#cartDrawer");
const cartItemsEl = qs("#cartItems");
const subtotalEl = qs("#subtotal");
const discountEl = qs("#discount");
const shippingEl = qs("#shipping");
const tipEl = qs("#tip");
const totalEl = qs("#total");

const openCartBtn = qs("#openCartBtn");
const closeCartBtn = qs("#closeCartBtn");
const drawerOverlay = qs("#drawerOverlay");
const fabCart = qs("#fabCart");

const themeBtn = qs("#themeBtn");
const hamburgerBtn = qs("#hamburgerBtn");
const mobileNav = qs("#mobileNav");

const surpriseBtn = qs("#surpriseBtn");
const openFeaturedBtn = qs("#openFeaturedBtn");

// store bar
const selectedStoreNameEl = qs("#selectedStoreName");
const selectedStoreHintEl = qs("#selectedStoreHint");
const goStoresBtn = qs("#goStoresBtn");
const clearStoreBtn = qs("#clearStoreBtn");
const storeListEl = qs("#storeList");

// cart settings
const segDelivery = qs("#segDelivery");
const segPickup = qs("#segPickup");
const couponInput = qs("#couponInput");
const applyCouponBtn = qs("#applyCouponBtn");
const couponMsg = qs("#couponMsg");

// modal
const productModal = qs("#productModal");
const modalOverlay = qs("#modalOverlay");
const closeModalBtn = qs("#closeModalBtn");
const modalTitle = qs("#modalTitle");
const modalImg = qs("#modalImg");
const modalDesc = qs("#modalDesc");
const modalRating = qs("#modalRating");
const modalPrice = qs("#modalPrice");
const modalExtras = qs("#modalExtras");
const modalQtyEl = qs("#modalQty");
const modalDec = qs("#modalDec");
const modalInc = qs("#modalInc");
const modalAddBtn = qs("#modalAddBtn");

let modalState = { productId: "", qty: 1, extras: {} };

// map
let map;
let storesLayer;
let userMarker;
const defaultMapView = { center: [-34.6037, -58.3816], zoom: 11 };

// ---------- Core helpers ----------
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function saveFavs() {
  localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
}
function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function saveStore() {
  if (selectedStoreId) localStorage.setItem(STORE_KEY, selectedStoreId);
  else localStorage.removeItem(STORE_KEY);
}

function ensureCartItem(id) {
  if (!cart[id]) cart[id] = { id, qty: 0, extras: {} };
}

function extrasPrice(extrasObj) {
  return EXTRAS.reduce(
    (sum, ex) => sum + (extrasObj?.[ex.key] ? ex.price : 0),
    0
  );
}

function cartCount() {
  return Object.values(cart).reduce((acc, it) => acc + it.qty, 0);
}

// Shipping logic (demo)
function calcShipping(subtotal) {
  if (settings.method === "pickup") return 0;
  if (subtotal <= 0) return 0;

  // base shipping
  let shipping = 2.5;

  // if no store selected, add small "service" fee (demo)
  if (!selectedStoreId) shipping += 0.75;

  // coupon ENVIOFREE
  const c = normalizeCoupon(settings.coupon);
  if (c === "ENVIOFREE") shipping = 0;

  return shipping;
}

function normalizeCoupon(code) {
  return (code || "").trim().toUpperCase();
}

function calcDiscount(subtotal) {
  const code = normalizeCoupon(settings.coupon);
  const coupon = COUPONS[code];
  if (!coupon) return 0;

  if (coupon.type === "percent") {
    return subtotal * (coupon.value / 100);
  }
  // shipping coupon doesn't discount subtotal
  return 0;
}

function calcTip(subtotalAfterDiscount) {
  const pct = Number(settings.tipPct || 0);
  return subtotalAfterDiscount * (pct / 100);
}

function findProduct(id) {
  return products.find((p) => p.id === id);
}

function getSelectedStore() {
  return stores.find((s) => s.id === selectedStoreId) || null;
}

// ---------- Theme ----------
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light") document.body.classList.add("light");
  updateThemeIcon();
}
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem(
    THEME_KEY,
    document.body.classList.contains("light") ? "light" : "dark"
  );
  updateThemeIcon();
}
function updateThemeIcon() {
  themeBtn.textContent = document.body.classList.contains("light")
    ? "☀️"
    : "🌙";
}

// ---------- Drawer ----------
function openDrawer() {
  cartDrawer.classList.add("open");
}
function closeDrawer() {
  cartDrawer.classList.remove("open");
}

// ---------- Modal ----------
function openModalForProduct(productId) {
  const p = findProduct(productId);
  if (!p) return;

  modalState = { productId, qty: 1, extras: {} };

  modalTitle.textContent = p.name;
  modalImg.src = p.img;
  modalImg.alt = p.name;
  modalDesc.textContent = p.desc;
  modalRating.textContent = `★ ${p.rating.toFixed(1)}`;
  modalPrice.textContent = money(p.price);

  modalQtyEl.textContent = String(modalState.qty);

  modalExtras.innerHTML = EXTRAS.map(
    (ex) => `
    <label class="tag" style="cursor:pointer">
      <input type="checkbox" data-modal-extra="${
        ex.key
      }" style="accent-color: var(--accent); margin-right:6px">
      ${ex.label} (+${money(ex.price)})
    </label>
  `
  ).join("");

  qsa("[data-modal-extra]", modalExtras).forEach((chk) => {
    chk.addEventListener("change", () => {
      const key = chk.getAttribute("data-modal-extra");
      modalState.extras[key] = chk.checked;
      updateModalPrice();
    });
  });

  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
}
function updateModalPrice() {
  const p = findProduct(modalState.productId);
  if (!p) return;
  const ex = extrasPrice(modalState.extras);
  modalPrice.textContent = money(p.price + ex);
}

// ---------- Carousel ----------
let slideIndex = 0;
let autoTimer = null;

function renderCarousel() {
  const track = qs("#carouselTrack");
  const dots = qs("#carouselDots");
  track.innerHTML = "";
  dots.innerHTML = "";

  carouselSlides.forEach((s, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `
      <img src="${s.img}" alt="${s.title}">
      <div class="slide__overlay">
        <div class="slide__title">${s.title}</div>
        <div class="slide__subtitle">${s.subtitle}</div>
      </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "dot" + (i === slideIndex ? " active" : "");
    dot.addEventListener("click", () => goToSlide(i, true));
    dots.appendChild(dot);
  });

  updateCarousel();
  startAuto(true);
}
function updateCarousel() {
  const track = qs("#carouselTrack");
  track.style.transform = `translateX(${-slideIndex * 100}%)`;
  qsa(".dot", qs("#carouselDots")).forEach((d, i) =>
    d.classList.toggle("active", i === slideIndex)
  );
}
function goToSlide(i, userAction = false) {
  slideIndex = (i + carouselSlides.length) % carouselSlides.length;
  updateCarousel();
  if (userAction) startAuto(true);
}
function nextSlide(userAction = false) {
  goToSlide(slideIndex + 1, userAction);
}
function prevSlide(userAction = false) {
  goToSlide(slideIndex - 1, userAction);
}

function startAuto(reset = false) {
  if (reset && autoTimer) clearInterval(autoTimer);
  if (autoTimer) return;
  autoTimer = setInterval(() => nextSlide(false), 4200);
}
function stopAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}

// ---------- Menu ----------
function categories() {
  const set = new Set(products.map((p) => p.category));
  return ["All", ...[...set].sort()];
}

function renderChips() {
  chipsWrap.innerHTML = "";
  categories().forEach((cat) => {
    const b = document.createElement("button");
    b.className = "chip" + (cat === activeCategory ? " active" : "");
    b.textContent = cat;
    b.addEventListener("click", () => {
      activeCategory = cat;
      renderChips();
      renderMenu();
    });
    chipsWrap.appendChild(b);
  });
}

function filteredProducts() {
  let list = [...products];

  if (activeCategory !== "All") {
    list = list.filter((p) => p.category === activeCategory);
  }
  if (searchTerm.trim()) {
    const t = searchTerm.trim().toLowerCase();
    list = list.filter((p) =>
      (p.name + " " + p.desc + " " + p.tags.join(" ")).toLowerCase().includes(t)
    );
  }

  if (sortMode === "priceAsc") list.sort((a, b) => a.price - b.price);
  if (sortMode === "priceDesc") list.sort((a, b) => b.price - a.price);
  if (sortMode === "ratingDesc") list.sort((a, b) => b.rating - a.rating);
  if (sortMode === "featured") {
    // featured first, then by rating desc
    list.sort((a, b) => b.featured - a.featured || b.rating - a.rating);
  }

  return list;
}

function renderMenu() {
  const list = filteredProducts();
  menuGrid.innerHTML = "";

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    empty.textContent = "No hay resultados con esos filtros.";
    menuGrid.appendChild(empty);
    return;
  }

  list.forEach((p) => {
    const inCartQty = cart[p.id]?.qty || 0;
    const isFav = favs.has(p.id);

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card__img">
        <img src="${p.img}" alt="${p.name}">
      </div>

      <div class="card__body">
        <div class="card__title">
          <h3>${p.name}</h3>
          <span class="rating">★ ${p.rating.toFixed(1)}</span>
        </div>

        <p class="muted" style="margin:0">${p.desc}</p>

        <div class="meta">
          ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
          <span class="tag">${p.category}</span>
          ${p.featured ? `<span class="tag">⭐ Destacado</span>` : ""}
        </div>

        <div class="price-row">
          <div class="price">${money(p.price)}</div>
          <button class="icon-btn" data-fav="${
            p.id
          }" title="Favorito" aria-label="Favorito">
            ${isFav ? "💛" : "❤"}
          </button>
        </div>

        <div class="card__actions">
          <div class="qty" aria-label="Cantidad">
            <button data-dec="${p.id}" aria-label="Restar">−</button>
            <span id="qty-${p.id}">${inCartQty}</span>
            <button data-inc="${p.id}" aria-label="Sumar">+</button>
          </div>

          <button class="btn primary" data-add="${
            p.id
          }" type="button">Agregar</button>
        </div>

        <div class="card__footer">
          <button class="small-btn" data-view="${
            p.id
          }" type="button">Ver detalles</button>
          <button class="small-btn" data-quick="${
            p.id
          }" type="button">+ Extras rápido</button>
        </div>
      </div>
    `;

    menuGrid.appendChild(card);
  });

  // Wire actions
  qsa("[data-add]").forEach((btn) =>
    btn.addEventListener("click", () =>
      addToCart(btn.getAttribute("data-add"), 1)
    )
  );
  qsa("[data-inc]").forEach((btn) =>
    btn.addEventListener("click", () =>
      addToCart(btn.getAttribute("data-inc"), 1)
    )
  );
  qsa("[data-dec]").forEach((btn) =>
    btn.addEventListener("click", () =>
      addToCart(btn.getAttribute("data-dec"), -1)
    )
  );

  qsa("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-fav");
      if (favs.has(id)) {
        favs.delete(id);
        toast("Quitado de favoritos");
      } else {
        favs.add(id);
        toast("Guardado en favoritos");
      }
      saveFavs();
      renderMenu();
    });
  });

  qsa("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () =>
      openModalForProduct(btn.getAttribute("data-view"))
    );
  });

  // Quick extras (agrega con queso+bacon)
  qsa("[data-quick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-quick");
      ensureCartItem(id);
      cart[id].extras = cart[id].extras || {};
      cart[id].extras.cheese = true;
      cart[id].extras.bacon = true;
      addToCart(id, 1, { silentToast: true });
      toast("Agregado con extras (queso + bacon)");
    });
  });
}

// ---------- Cart operations ----------
function addToCart(id, delta, opts = {}) {
  ensureCartItem(id);
  cart[id].qty += delta;

  if (cart[id].qty <= 0) {
    delete cart[id];
    if (!opts.silentToast) toast("Eliminado del carrito");
  } else {
    if (!opts.silentToast)
      toast(delta > 0 ? "Agregado al carrito" : "Cantidad actualizada");
  }

  saveCart();
  updateCartBadges();
  renderMenu();
  renderCart();
}

function removeFromCart(id) {
  if (cart[id]) delete cart[id];
  saveCart();
  updateCartBadges();
  renderMenu();
  renderCart();
  toast("Eliminado");
}

function calcSubtotal() {
  let sum = 0;
  for (const item of Object.values(cart)) {
    const p = findProduct(item.id);
    if (!p) continue;
    const ex = extrasPrice(item.extras);
    sum += (p.price + ex) * item.qty;
  }
  return sum;
}

function renderCart() {
  const items = Object.values(cart);

  if (items.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty">Tu carrito está vacío. Agrega algo del menú 🍟</div>`;
  } else {
    cartItemsEl.innerHTML = "";
    items.forEach((item) => {
      const p = findProduct(item.id);
      if (!p) return;

      const exList = EXTRAS.filter((ex) => item.extras?.[ex.key])
        .map((ex) => ex.label)
        .join(", ");

      const exPrice = extrasPrice(item.extras);
      const unit = p.price + exPrice;

      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div>
          <div class="cart-item__top">
            <div>
              <h4>${p.name}</h4>
              <div class="muted">${
                exList ? `Extras: ${exList}` : "Sin extras"
              }</div>
            </div>
            <button class="link-danger" data-remove="${
              p.id
            }" aria-label="Eliminar">Eliminar</button>
          </div>

          <div class="cart-item__bottom">
            <div class="qty" aria-label="Cantidad en carrito">
              <button data-dec="${p.id}" aria-label="Restar">−</button>
              <span>${item.qty}</span>
              <button data-inc="${p.id}" aria-label="Sumar">+</button>
            </div>
            <strong>${money(unit * item.qty)}</strong>
          </div>

          <div class="row" style="margin-top:8px">
            ${EXTRAS.map(
              (ex) => `
              <label class="tag" style="cursor:pointer">
                <input type="checkbox" data-cart-extra="${p.id}:${ex.key}" ${
                item.extras?.[ex.key] ? "checked" : ""
              } style="accent-color: var(--accent); margin-right:6px">
                ${ex.label}
              </label>
            `
            ).join("")}
          </div>
        </div>
      `;
      cartItemsEl.appendChild(row);
    });

    qsa("[data-remove]", cartItemsEl).forEach((btn) =>
      btn.addEventListener("click", () =>
        removeFromCart(btn.getAttribute("data-remove"))
      )
    );
    qsa("[data-inc]", cartItemsEl).forEach((btn) =>
      btn.addEventListener("click", () =>
        addToCart(btn.getAttribute("data-inc"), 1)
      )
    );
    qsa("[data-dec]", cartItemsEl).forEach((btn) =>
      btn.addEventListener("click", () =>
        addToCart(btn.getAttribute("data-dec"), -1)
      )
    );

    qsa("[data-cart-extra]", cartItemsEl).forEach((chk) => {
      chk.addEventListener("change", () => {
        const [pid, key] = chk.getAttribute("data-cart-extra").split(":");
        ensureCartItem(pid);
        cart[pid].extras = cart[pid].extras || {};
        cart[pid].extras[key] = chk.checked;
        saveCart();
        renderCart(); // recalcula totales
      });
    });
  }

  // Totals
  const sub = calcSubtotal();
  const disc = calcDiscount(sub);
  const subAfterDisc = Math.max(0, sub - disc);
  const ship = calcShipping(subAfterDisc);
  const tip = calcTip(subAfterDisc);
  const total = subAfterDisc + ship + tip;

  subtotalEl.textContent = money(sub);
  discountEl.textContent = `-${money(disc)}`;
  shippingEl.textContent = money(ship);
  tipEl.textContent = money(tip);
  totalEl.textContent = money(total);

  // Coupon UI msg
  renderCouponMsg();
}

function updateCartBadges() {
  const c = cartCount();
  cartCountEl.textContent = String(c);
  cartCountFabEl.textContent = String(c);
}

// ---------- Coupon UI ----------
function renderCouponMsg() {
  const code = normalizeCoupon(settings.coupon);
  if (!code) {
    couponMsg.textContent =
      "Cupones demo: GOURMAND10 (10% OFF), ENVIOFREE (envío gratis).";
    return;
  }
  const c = COUPONS[code];
  if (!c) {
    couponMsg.textContent = "Cupón inválido. Probá: GOURMAND10 o ENVIOFREE.";
    return;
  }
  couponMsg.textContent = `Cupón aplicado: ${code} — ${c.label}`;
}

// ---------- Store bar ----------
function renderStoreBar() {
  const store = getSelectedStore();
  if (store) {
    selectedStoreNameEl.textContent = store.name;
    selectedStoreHintEl.textContent = `${store.address} · ${store.hours}`;
  } else {
    selectedStoreNameEl.textContent = "No seleccionada";
    selectedStoreHintEl.textContent =
      "Elegí una sucursal en el mapa.";
  }
}

// ---------- Map ----------
function renderStoreList() {
  storeListEl.innerHTML = "";
  stores.forEach((s) => {
    const isSelected = s.id === selectedStoreId;
    const el = document.createElement("div");
    el.className = "storeitem";
    el.innerHTML = `
      <strong>${s.name}</strong>
      <div class="tiny muted">${s.address}</div>
      <div class="tiny muted"><strong>Horario:</strong> ${s.hours}</div>
      <div class="row">
        <button class="btn" data-zoom="${
          s.id
        }" type="button">Ver en mapa</button>
        <button class="btn ${isSelected ? "primary" : ""}" data-pick="${
      s.id
    }" type="button">
          ${isSelected ? "Seleccionada" : "Seleccionar"}
        </button>
      </div>
    `;
    storeListEl.appendChild(el);
  });

  qsa("[data-zoom]").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-zoom");
      const store = stores.find((x) => x.id === id);
      if (store && map) {
        map.setView(store.coords, 14);
        toast("Mostrando sucursal en el mapa");
      }
    });
  });

  qsa("[data-pick]").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-pick");
      selectStore(id);
    });
  });
}

function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView(defaultMapView.center, defaultMapView.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  storesLayer = L.layerGroup().addTo(map);

  stores.forEach((s) => {
    const popupHTML = `
      <div style="min-width:220px">
        <strong>${s.name}</strong><br>
        <span>${s.address}</span><br>
        <span><strong>Horario:</strong> ${s.hours}</span><br><br>
        <button id="pick-${slug(s.id)}" style="
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

    const marker = L.marker(s.coords).addTo(storesLayer);
    marker.bindPopup(popupHTML);

    marker.on("popupopen", () => {
      const btn = document.getElementById(`pick-${slug(s.id)}`);
      if (btn) {
        btn.onclick = () => selectStore(s.id);
      }
    });
  });

  // Buttons
  const locateBtn = document.getElementById("locateBtn");
  const resetBtn = document.getElementById("resetMapBtn");

  if (locateBtn) locateBtn.addEventListener("click", locateUser);
  if (resetBtn)
    resetBtn.addEventListener("click", () => {
      if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
      }
      map.setView(defaultMapView.center, defaultMapView.zoom);
      toast("Mapa reseteado");
    });
}

function locateUser() {
  if (!navigator.geolocation) {
    toast("Tu navegador no soporta geolocalización");
    return;
  }
  toast("Buscando tu ubicación...");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = [pos.coords.latitude, pos.coords.longitude];
      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.marker(coords)
        .addTo(map)
        .bindPopup("📍 Estás acá")
        .openPopup();
      map.setView(coords, 14);
      toast("Ubicación encontrada");
    },
    () => toast("No se pudo obtener tu ubicación"),
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function selectStore(storeId) {
  selectedStoreId = storeId;
  saveStore();
  renderStoreBar();
  renderStoreList();
  renderCart(); // shipping puede cambiar
  toast("Sucursal seleccionada");
}

// ---------- Events ----------
function wireEvents() {
  // Carousel
  qs("#nextSlide").addEventListener("click", () => nextSlide(true));
  qs("#prevSlide").addEventListener("click", () => prevSlide(true));
  qs(".carousel").addEventListener("mouseenter", stopAuto);
  qs(".carousel").addEventListener("mouseleave", () => startAuto(true));

  // Search + sort
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderMenu();
  });
  sortSelect.addEventListener("change", (e) => {
    sortMode = e.target.value;
    renderMenu();
  });

  // Drawer
  openCartBtn.addEventListener("click", openDrawer);
  fabCart.addEventListener("click", openDrawer);
  closeCartBtn.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);

  // Theme
  themeBtn.addEventListener("click", toggleTheme);

  // Mobile nav
  hamburgerBtn.addEventListener("click", () =>
    mobileNav.classList.toggle("open")
  );
  qsa(".mobile-nav a").forEach((a) =>
    a.addEventListener("click", () => mobileNav.classList.remove("open"))
  );

  // Surprise
  surpriseBtn.addEventListener("click", () => {
    const pick = products[Math.floor(Math.random() * products.length)];
    addToCart(pick.id, 1);
    openDrawer();
  });

  // Featured button
  openFeaturedBtn.addEventListener("click", () => {
    activeCategory = "All";
    searchTerm = "";
    searchInput.value = "";
    sortMode = "featured";
    sortSelect.value = "featured";
    renderChips();
    renderMenu();
    toast("Mostrando destacados primero ⭐");
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });

  // Store bar
  goStoresBtn.addEventListener("click", () => {
    document.getElementById("stores").scrollIntoView({ behavior: "smooth" });
  });
  clearStoreBtn.addEventListener("click", () => {
    selectedStoreId = "";
    saveStore();
    renderStoreBar();
    renderStoreList();
    renderCart();
    toast("Sucursal removida");
  });

  // Modal close
  modalOverlay.addEventListener("click", closeModal);
  closeModalBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeDrawer();
    }
  });

  // Modal qty
  modalInc.addEventListener("click", () => {
    modalState.qty += 1;
    modalQtyEl.textContent = String(modalState.qty);
  });
  modalDec.addEventListener("click", () => {
    modalState.qty = Math.max(1, modalState.qty - 1);
    modalQtyEl.textContent = String(modalState.qty);
  });
  modalAddBtn.addEventListener("click", () => {
    const id = modalState.productId;
    if (!id) return;
    ensureCartItem(id);
    cart[id].extras = {
      ...(cart[id].extras || {}),
      ...(modalState.extras || {}),
    };
    addToCart(id, modalState.qty, { silentToast: true });
    toast("Agregado desde detalles");
    closeModal();
    openDrawer();
  });

  // Cart actions
  qs("#clearCartBtn").addEventListener("click", () => {
    cart = {};
    saveCart();
    updateCartBadges();
    renderMenu();
    renderCart();
    toast("Carrito vacío");
  });

  // Delivery/Pickup
  function setMethod(m) {
    settings.method = m;
    saveSettings();
    segDelivery.classList.toggle("active", m === "delivery");
    segPickup.classList.toggle("active", m === "pickup");
    toast(m === "pickup" ? "Pickup: envío $0" : "Delivery seleccionado");
    renderCart();
  }
  segDelivery.addEventListener("click", () => setMethod("delivery"));
  segPickup.addEventListener("click", () => setMethod("pickup"));

  // Tip buttons
  qsa("[data-tip]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pct = Number(btn.getAttribute("data-tip"));
      settings.tipPct = pct;
      saveSettings();
      qsa("[data-tip]").forEach((b) =>
        b.classList.toggle("active", Number(b.getAttribute("data-tip")) === pct)
      );
      toast(`Propina: ${pct}%`);
      renderCart();
    });
  });

  // Coupon apply
  applyCouponBtn.addEventListener("click", () => {
    const code = normalizeCoupon(couponInput.value);
    settings.coupon = code;
    saveSettings();
    if (!code) {
      toast("Cupón limpiado");
    } else {
      toast(COUPONS[code] ? "Cupón aplicado" : "Cupón inválido");
    }
    renderCart();
  });

  // Checkout
  qs("#checkoutBtn").addEventListener("click", () => checkoutDemo());
}

// ---------- Settings hydrate UI ----------
function hydrateSettingsUI() {
  // method
  segDelivery.classList.toggle("active", settings.method === "delivery");
  segPickup.classList.toggle("active", settings.method === "pickup");

  // tip
  qsa("[data-tip]").forEach((b) =>
    b.classList.toggle(
      "active",
      Number(b.getAttribute("data-tip")) === Number(settings.tipPct)
    )
  );

  // coupon
  couponInput.value = settings.coupon || "";
  renderCouponMsg();
}

// ---------- Checkout ----------
function checkoutDemo() {
  const items = Object.values(cart);
  if (items.length === 0) {
    toast("Agrega algo primero 🙂");
    return;
  }

  const store = getSelectedStore();
  const method = settings.method === "pickup" ? "Pickup" : "Delivery";
  const coupon = normalizeCoupon(settings.coupon);
  const tipPct = Number(settings.tipPct || 0);

  const sub = calcSubtotal();
  const disc = calcDiscount(sub);
  const subAfterDisc = Math.max(0, sub - disc);
  const ship = calcShipping(subAfterDisc);
  const tip = calcTip(subAfterDisc);
  const total = subAfterDisc + ship + tip;

  const lines = items
    .map((it) => {
      const p = findProduct(it.id);
      const ex = EXTRAS.filter((e) => it.extras?.[e.key])
        .map((e) => e.label)
        .join(", ");
      return `• ${p?.name ?? it.id} x${it.qty}${ex ? ` (Extras: ${ex})` : ""}`;
    })
    .join("\n");

  const summary = `Pedido demo creado

Sucursal: ${store ? store.name : "No seleccionada"}
Método: ${method}
Cupón: ${coupon || "—"}
Propina: ${tipPct}%

Items:
${lines}

Subtotal: ${money(sub)}
Descuento: -${money(disc)}
Envío: ${money(ship)}
Propina: ${money(tip)}
TOTAL: ${money(total)}
`;

  alert(summary);

  // Save "last order"
  localStorage.setItem(
    CHECKOUT_KEY,
    JSON.stringify({
      createdAt: new Date().toISOString(),
      store: store ? store.name : null,
      method,
      coupon: coupon || null,
      tipPct,
      subtotal: sub,
      discount: disc,
      shipping: ship,
      tip,
      total,
    })
  );

  cart = {};
  saveCart();
  updateCartBadges();
  renderMenu();
  renderCart();
  closeDrawer();
  toast("¡Gracias! Pedido demo guardado");
}

// ---------- Init ----------
function init() {
  // theme
  initTheme();

  // carousel
  renderCarousel();

  // menu
  renderChips();
  renderMenu();

  // store bar
  renderStoreBar();
  renderStoreList();

  // cart
  updateCartBadges();
  hydrateSettingsUI();
  renderCart();

  // map
  initMap();

  // events
  wireEvents();
}

init();
