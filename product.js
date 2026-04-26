document.addEventListener("DOMContentLoaded", () => {

  let totalItems = 0;
  let totalPrice = 0;

  /* ================= CART ================= */
  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  const products = document.querySelectorAll(".product-card");

  const cartList = document.createElement("div");
  cartList.id = "cart-list";

  const summary = document.querySelector(".cart-summary");
  if (summary) summary.appendChild(cartList);

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateUI() {
    const itemsEl = document.getElementById("total-items");
    const priceEl = document.getElementById("total-price");

    if (itemsEl) itemsEl.textContent = totalItems;
    if (priceEl) priceEl.textContent = totalPrice;

    renderCart();
  }

  function renderCart() {

    if (!cartList) return;

    cartList.innerHTML = "";

    totalItems = 0;
    totalPrice = 0;

    Object.keys(cart).forEach(name => {

      const item = cart[name];

      totalItems += item.qty;
      totalPrice += item.qty * item.price;

      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.marginTop = "10px";
      div.style.padding = "10px";
      div.style.background = "#f7f7f7";
      div.style.borderRadius = "8px";

      div.innerHTML = `
        <span>${name} (x${item.qty})</span>
        <button class="remove" data-name="${name}">Remove</button>
      `;

      cartList.appendChild(div);
    });

    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        delete cart[name];
        saveCart();
        updateUI();
      });
    });
  }

  /* ================= PRODUCTS ================= */
  products.forEach(product => {

    const slides = product.querySelector(".slides");
    const images = product.querySelectorAll(".slides img");

    const next = product.querySelector(".next");
    const prev = product.querySelector(".prev");

    const dotsContainer = product.querySelector(".dots");

    const qtyText = product.querySelector(".qty");
    const addBtn = product.querySelector(".add-cart");

    const price = Number(product.dataset.price);
    const name = product.querySelector("h3").textContent;

    let index = 0;
    let qty = 1;

    /* DOTS */
    images.forEach(() => {
      dotsContainer.appendChild(document.createElement("span"));
    });

    const dots = dotsContainer.querySelectorAll("span");

    function updateSlider() {
      slides.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove("active"));
      dots[index].classList.add("active");
    }

    next.onclick = () => {
      index = (index + 1) % images.length;
      updateSlider();
    };

    prev.onclick = () => {
      index = (index - 1 + images.length) % images.length;
      updateSlider();
    };

    dots.forEach((dot, i) => {
      dot.onclick = () => {
        index = i;
        updateSlider();
      };
    });

    setInterval(() => {
      index = (index + 1) % images.length;
      updateSlider();
    }, 4000);

    updateSlider();

    /* QTY */
    const plus = product.querySelector(".plus");
    const minus = product.querySelector(".minus");

    if (plus) {
      plus.onclick = () => {
        qty++;
        qtyText.textContent = qty;
      };
    }

    if (minus) {
      minus.onclick = () => {
        if (qty > 1) {
          qty--;
          qtyText.textContent = qty;
        }
      };
    }

    /* ADD TO CART */
    addBtn.onclick = () => {

      if (!cart[name]) {
        cart[name] = {
          qty: 0,
          price: price
        };
      }

      cart[name].qty += qty;

      saveCart();

      addBtn.textContent = "Added ✓";

      setTimeout(() => {
        addBtn.textContent = "Add to Cart";
      }, 1000);

      updateUI();
    };

  });

  /* ================= ORDER BUTTON ================= */
  const orderBtn = document.querySelector(".order-now");

  if (orderBtn) {
    orderBtn.onclick = () => {

      if (Object.keys(cart).length === 0) {
        alert("Cart is empty!");
        return;
      }

      alert(`ORDER SUMMARY\nItems: ${totalItems}\nTotal: ₦${totalPrice}`);
    };
  }

  /* ================= INIT ================= */
  renderCart();
  updateUI();

});

/* ================= MOBILE MENU (FIXED ONLY ONCE) ================= */
function toggleMenu() {
  const nav = document.querySelector(".nav-links");
  if (nav) nav.classList.toggle("active");
}

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }
});