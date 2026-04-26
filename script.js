
/* ================= NAVBAR SCROLL EFFECT ================= */
window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle(
    "scrolled",
    window.scrollY > 50
  );
});


/* ================= MOBILE MENU TOGGLE ================= */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}


/* ================= ABOUT / SCROLL REVEAL ================= */
const revealItems = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealItems.forEach((el) => {
    const top = el.getBoundingClientRect().top;

    if (top < windowHeight - 120) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


/* ================= OPTIONAL: SMOOTH NAV SCROLL ================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }

    // close mobile menu after click
    navLinks.classList.remove("show");
  });
});


/* ================= FIREBASE PRODUCT LOADING ================= */
/* ⚠️ Make sure db is already initialized in firebaseConfig file */

import {
  onSnapshot,
  collection
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

if (typeof db !== "undefined") {
  const productContainer = document.getElementById("productContainer");

  if (productContainer) {
    onSnapshot(collection(db, "products"), (snapshot) => {
      productContainer.innerHTML = "";

      snapshot.forEach((doc) => {
        const p = doc.data();

        productContainer.innerHTML += `
          <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>₦${p.price}</p>
          </div>
        `;
      });
    });
  }
}