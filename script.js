const PRODUCTS = [
  { id: "p1", title: "Смарт-часы Pulse One", price: 5490 },
  { id: "p2", title: "Беспроводные наушники AirTone", price: 3990 },
  { id: "p3", title: "Портативная колонка Wave Mini", price: 4690 },
  { id: "p4", title: "Механическая клавиатура NeoType", price: 7290 },
  { id: "p5", title: "Компьютерная мышь Swift Pro", price: 2890 },
  { id: "p6", title: "Пауэрбанк 20000 mAh", price: 2590 },
  { id: "p7", title: "Веб-камера Full HD", price: 3490 },
  { id: "p8", title: "Настольная LED-лампа", price: 1990 }
];

const CART_STORAGE_KEY = "minimal_store_cart_v1";

const productsGrid = document.getElementById("productsGrid");
const cartList = document.getElementById("cartList");
const cartCount = document.getElementById("cartCount");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const orderForm = document.getElementById("orderForm");
const successMessage = document.getElementById("successMessage");

const productTemplate = document.getElementById("productCardTemplate");
const cartItemTemplate = document.getElementById("cartItemTemplate");

let cart = loadCart();

function formatPrice(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function renderProducts() {
  const fragment = document.createDocumentFragment();

  PRODUCTS.forEach((product) => {
    const node = productTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".product-title").textContent = product.title;
    node.querySelector(".product-price").textContent = formatPrice(product.price);
    node.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(product.id));
    fragment.append(node);
  });

  productsGrid.append(fragment);
}

function getCartItems() {
  return Object.entries(cart)
    .map(([id, quantity]) => {
      const product = PRODUCTS.find((item) => item.id === id);
      if (!product) return null;
      return { product, quantity: Number(quantity) || 0 };
    })
    .filter((entry) => entry && entry.quantity > 0);
}

function addToCart(productId) {
  cart[productId] = (Number(cart[productId]) || 0) + 1;
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  renderCart();
}

function updateQuantity(productId, quantity) {
  const normalized = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  const safeQuantity = Math.max(1, normalized);
  cart[productId] = safeQuantity;
  saveCart();
  renderCart();
}

function renderCart() {
  const cartItems = getCartItems();
  cartList.innerHTML = "";

  if (!cartItems.length) {
    cartList.innerHTML = "<li class='cart-item'>Корзина пуста</li>";
    cartCount.textContent = "0";
    totalPrice.textContent = formatPrice(0);
    return;
  }

  const fragment = document.createDocumentFragment();
  let totalItems = 0;
  let totalCost = 0;

  cartItems.forEach(({ product, quantity }) => {
    totalItems += quantity;
    totalCost += product.price * quantity;

    const node = cartItemTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".cart-item-title").textContent = product.title;
    node.querySelector(".cart-item-price").textContent = `${formatPrice(product.price)} × ${quantity}`;

    const qtyInput = node.querySelector(".qty-input");
    qtyInput.value = String(quantity);
    qtyInput.addEventListener("change", (event) => {
      const value = Number(event.target.value);
      updateQuantity(product.id, Number.isFinite(value) ? value : 1);
    });

    node.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(product.id));
    fragment.append(node);
  });

  cartList.append(fragment);
  cartCount.textContent = String(totalItems);
  totalPrice.textContent = formatPrice(totalCost);
}

function openModal() {
  checkoutModal.classList.remove("hidden");
}

function closeModal() {
  checkoutModal.classList.add("hidden");
  successMessage.classList.add("hidden");
}

function setupModalEvents() {
  checkoutBtn.addEventListener("click", openModal);

  checkoutModal.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !checkoutModal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

function setupForm() {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }

    successMessage.classList.remove("hidden");

    cart = {};
    saveCart();
    renderCart();
    orderForm.reset();
  });
}

renderProducts();
renderCart();
setupModalEvents();
setupForm();