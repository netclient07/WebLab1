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

const productsGrid = document.getElementById("productsGrid");
const productTemplate = document.getElementById("productCardTemplate");

function formatPrice(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function renderProducts() {
  const fragment = document.createDocumentFragment();

  PRODUCTS.forEach((product) => {
    const node = productTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".product-title").textContent = product.title;
    node.querySelector(".product-price").textContent = formatPrice(product.price);
    fragment.append(node);
  });

  productsGrid.append(fragment);
}

renderProducts();