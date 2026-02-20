export const EXTRAS = [
  { key: "cheese", label: "Extra queso", price: 0.8 },
  { key: "bacon", label: "Bacon", price: 1.2 },
  { key: "sauce", label: "Salsa especial", price: 0.5 },
];

export const PRODUCTS = [
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

export const CAROUSEL_SLIDES = [
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

export const STORES = [
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

export const COUPONS = {
  GOURMAND10: { type: "percent", value: 10, label: "10% OFF en subtotal" },
  ENVIOFREE: {
    type: "shipping",
    value: 100,
    label: "Envío gratis (solo delivery)",
  },
};
