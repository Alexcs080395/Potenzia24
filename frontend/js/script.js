(() => {
  const getApiBaseUrl = () => {
    if (window.POTENZIA_API_BASE_URL) return window.POTENZIA_API_BASE_URL;
    if (window.API_BASE_URL) return window.API_BASE_URL;

    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    return isLocal ? "http://localhost:3000" : "https://potenzia24.com";
  };

  const apiBaseUrl = getApiBaseUrl();
  window.API_BASE_URL = apiBaseUrl;
  window.POTENZIA_API_BASE_URL = apiBaseUrl;

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav) mainNav.classList.remove("active");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 90) {
        element.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);
  revealOnScroll();

  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = newsletterForm.querySelector("input");
      const email = input?.value.trim();

      if (!email) return;

      alert("Gracias por unirte a Potenzia24.");
      input.value = "";
    });
  }

  const featuredMagazineCard = document.getElementById("featuredMagazineCard");
  const featuredMagazineCover = document.getElementById("featuredMagazineCover");
  const featuredMagazineMeta = document.getElementById("featuredMagazineMeta");
  const featuredMagazineTitle = document.getElementById("featuredMagazineTitle");
  const featuredMagazineSummary = document.getElementById("featuredMagazineSummary");
  const heroMagazineEdition = document.getElementById("heroMagazineEdition");
  const heroMagazineCategory = document.getElementById("heroMagazineCategory");
  const heroMagazineTags = document.getElementById("heroMagazineTags");

  const latestSectionTitle = document.getElementById("latestSectionTitle");
  const featuredSectionCover = document.getElementById("featuredSectionCover");
  const featuredEditionLabel = document.getElementById("featuredEditionLabel");
  const featuredCategoryLabel = document.getElementById("featuredCategoryLabel");
  const featuredContentTitle = document.getElementById("featuredContentTitle");
  const featuredMetaTags = document.getElementById("featuredMetaTags");
  const featuredReadButton = document.getElementById("featuredReadButton");

  const hasIndexMagazine = featuredMagazineCard || featuredSectionCover;

  if (!hasIndexMagazine) return;

  const getCoverUrl = (coverImage) => {
    if (!coverImage) return "";
    if (String(coverImage).startsWith("http")) return coverImage;
    return `${apiBaseUrl}${coverImage}`;
  };

  const normalizeText = (text) => {
    if (!text) return "";
    return String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  const formatEdition = (editionNumber) => {
    if (!editionNumber) return "Edición publicada";
    const value = String(editionNumber).trim();
    return value.toLowerCase().startsWith("edición") ? value : `Edición ${value}`;
  };

  const renderTags = (container, magazine) => {
    if (!container) return;

    const tags = [magazine.category, "Lectura digital", "Potenzia24"].filter(Boolean);

    container.innerHTML = tags
      .slice(0, 3)
      .map((tag) => `<span>${normalizeText(tag)}</span>`)
      .join("");
  };

  const applyCoverBackground = (element, coverUrl) => {
    if (!element || !coverUrl) return;

    element.classList.add("dynamic-cover");
    element.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.78)), url('${coverUrl}')`;
  };

  const renderFeaturedMagazine = (magazine) => {
    if (!magazine) {
      if (featuredMagazineTitle) featuredMagazineTitle.textContent = "Todavía no hay revistas publicadas";
      if (featuredMagazineSummary) featuredMagazineSummary.textContent = "Publica tu primera revista desde el panel editorial.";
      if (featuredMagazineMeta) featuredMagazineMeta.textContent = "Sin publicaciones";
      if (featuredMagazineCard) featuredMagazineCard.href = "revistas.html";
      if (featuredMagazineCover) featuredMagazineCover.innerHTML = `<span>Sin portada</span>`;
      if (featuredContentTitle) featuredContentTitle.textContent = "Todavía no hay revistas publicadas";
      if (featuredReadButton) featuredReadButton.href = "revistas.html";
      return;
    }

    const coverUrl = getCoverUrl(magazine.cover_image);
    const magazineUrl = `revista.html?slug=${encodeURIComponent(magazine.slug)}`;
    const editionText = formatEdition(magazine.edition_number);
    const categoryText = magazine.category || "Revista digital";
    const titleText = magazine.title || "Revista publicada";
    const summaryText = magazine.summary || "Lee la edición más reciente de Potenzia24.";

    if (featuredMagazineCard) {
      featuredMagazineCard.href = magazineUrl;
      applyCoverBackground(featuredMagazineCard, coverUrl);
    }

    if (featuredMagazineCover && coverUrl) {
      featuredMagazineCover.innerHTML = "";
    }

    if (heroMagazineEdition) heroMagazineEdition.textContent = editionText;
    if (heroMagazineCategory) heroMagazineCategory.textContent = categoryText;
    if (featuredMagazineMeta) featuredMagazineMeta.textContent = categoryText;
    if (featuredMagazineTitle) featuredMagazineTitle.textContent = titleText;
    if (featuredMagazineSummary) featuredMagazineSummary.textContent = summaryText;
    renderTags(heroMagazineTags, magazine);

    if (latestSectionTitle) latestSectionTitle.textContent = titleText;
    if (featuredSectionCover) applyCoverBackground(featuredSectionCover, coverUrl);
    if (featuredEditionLabel) featuredEditionLabel.textContent = editionText;
    if (featuredCategoryLabel) featuredCategoryLabel.textContent = categoryText;
    if (featuredContentTitle) featuredContentTitle.textContent = titleText;
    if (featuredReadButton) featuredReadButton.href = magazineUrl;
    renderTags(featuredMetaTags, magazine);
  };

  const loadIndexMagazine = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/magazines`);

      if (!response.ok) {
        throw new Error("No se pudieron cargar las revistas");
      }

      const magazines = await response.json();
      renderFeaturedMagazine(Array.isArray(magazines) ? magazines[0] : null);
    } catch (error) {
      console.error("Error al cargar revistas en index:", error);

      if (featuredMagazineTitle) featuredMagazineTitle.textContent = "No pudimos cargar la última revista";
      if (featuredMagazineSummary) featuredMagazineSummary.textContent = "Revisa que el backend esté funcionando correctamente.";
      if (featuredMagazineMeta) featuredMagazineMeta.textContent = "Error de conexión";
      if (featuredMagazineCover) featuredMagazineCover.innerHTML = `<span>Error al cargar</span>`;
      if (featuredContentTitle) featuredContentTitle.textContent = "No pudimos cargar la última revista";
      if (featuredEditionLabel) featuredEditionLabel.textContent = "Error de conexión";
    }
  };

  loadIndexMagazine();
})();
