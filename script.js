function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle(
    "scrolled",
    window.scrollY > 50
  );
});

/* ================= ABOUT SCROLL REVEAL ================= */
const revealItems = document.querySelectorAll(".reveal");
const aboutImg = document.querySelector(".about-image img");

function showAboutOnScroll() {
  const windowHeight = window.innerHeight;

  revealItems.forEach((el) => {
    const top = el.getBoundingClientRect().top;

    if (top < windowHeight - 120) {
      el.classList.add("active");

      if (aboutImg) {
        aboutImg.classList.add("active");
      }
    }
  });
}

window.addEventListener("scroll", showAboutOnScroll);
showAboutOnScroll();
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', function(){
navLinks.classList.toggle('active');
});
