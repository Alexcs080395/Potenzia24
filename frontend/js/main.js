// =========================
// MENÚ RESPONSIVE
// =========================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Cerrar menú al dar clic en un enlace
const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// =========================
// ANIMACIÓN AL HACER SCROLL
// =========================

const elementsToReveal = document.querySelectorAll(
  ".category-card, .article-card, .editorial-content, .editorial-stats div, .community-card"
);

elementsToReveal.forEach((element) => {
  element.classList.add("reveal");
});

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;

  elementsToReveal.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < windowHeight - 80) {
      element.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// =========================
// PEQUEÑO EFECTO EN HEADER
// =========================


const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.style.background = "rgba(5, 11, 26, 0.92)";
  } else {
    header.style.background = "rgba(5, 11, 26, 0.78)";
  }
});