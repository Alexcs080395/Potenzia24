(() => {
  const apiBaseUrl = window.POTENZIA_API_BASE_URL || window.API_BASE_URL || "https://potenzia24.com";

  const magazinesGrid = document.getElementById("magazinesGrid");
  const magazinesLoading = document.getElementById("magazinesLoading");
  const magazinesError = document.getElementById("magazinesError");
  const magazinesEmpty = document.getElementById("magazinesEmpty");

  if (!magazinesGrid) return;

  const show = (element, visible = true) => {
    if (!element) return;
    element.hidden = !visible;
    element.style.display = visible ? "" : "none";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";

    const date = new Date(dateString);

    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const normalizeText = (text) => {
    if (!text) return "";

    return String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  const getCoverUrl = (coverImage) => {
    if (!coverImage) return "";
    if (String(coverImage).startsWith("http")) return coverImage;
    return `${apiBaseUrl}${coverImage}`;
  };

  const createMagazineCard = (magazine) => {
    const card = document.createElement("a");
    card.className = "magazine-published-card reveal visible";
    card.href = `revista.html?slug=${encodeURIComponent(magazine.slug)}`;

    const coverUrl = getCoverUrl(magazine.cover_image);
    const coverMarkup = coverUrl
      ? `<img src="${coverUrl}" alt="Portada ${normalizeText(magazine.title)}" loading="lazy">`
      : `<span>Sin portada</span>`;

    card.innerHTML = `
      <div class="magazine-published-cover">
        ${coverMarkup}
      </div>

      <div class="magazine-published-content">
        <p class="article-meta">
          ${normalizeText(magazine.edition_number || "Edición publicada")} · ${normalizeText(magazine.category || "Potenzia24")}
        </p>

        <h3>${normalizeText(magazine.title || "Revista publicada")}</h3>

        <p>${normalizeText(magazine.summary || "Lee esta edición publicada de Potenzia24.")}</p>

        <div class="article-footer">
          <span>${formatDate(magazine.publish_date)}</span>
          <span>Leer edición →</span>
        </div>
      </div>
    `;

    card.addEventListener("click", (event) => {
      const isTouchDevice = window.matchMedia("(hover: none)").matches;

      if (isTouchDevice && !card.classList.contains("show-info")) {
        event.preventDefault();

        document.querySelectorAll(".magazine-published-card").forEach((item) => {
          item.classList.remove("show-info");
        });

        card.classList.add("show-info");
      }
    });

    return card;
  };

  const loadMagazines = async () => {
    try {
      show(magazinesLoading, true);
      show(magazinesError, false);
      show(magazinesEmpty, false);
      magazinesGrid.innerHTML = "";

      const response = await fetch(`${apiBaseUrl}/api/magazines`);

      if (!response.ok) {
        throw new Error("No se pudieron cargar las revistas");
      }

      const magazines = await response.json();

      show(magazinesLoading, false);

      if (!Array.isArray(magazines) || magazines.length === 0) {
        show(magazinesEmpty, true);
        return;
      }

      magazines.forEach((magazine) => {
        magazinesGrid.appendChild(createMagazineCard(magazine));
      });
    } catch (error) {
      console.error("Error al cargar revistas:", error);

      show(magazinesLoading, false);
      show(magazinesError, true);
    }
  };

  loadMagazines();
})();
