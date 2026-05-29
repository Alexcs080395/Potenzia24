const API_BASE_URL = "http://localhost:3000";

const featuredMagazineCard = document.getElementById("featuredMagazineCard");
const featuredMagazineCover = document.getElementById("featuredMagazineCover");
const featuredMagazineMeta = document.getElementById("featuredMagazineMeta");
const featuredMagazineTitle = document.getElementById("featuredMagazineTitle");
const featuredMagazineSummary = document.getElementById("featuredMagazineSummary");

const recentPublicationsGrid = document.getElementById("recentPublicationsGrid");

const getCoverUrl = (coverImage) => {
  if (!coverImage) return "";

  if (coverImage.startsWith("http")) {
    return coverImage;
  }

  return `${API_BASE_URL}${coverImage}`;
};

const normalizeText = (text) => {
  if (!text) return "";

  return String(text)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

const renderFeaturedMagazine = (magazine) => {
  if (
    !featuredMagazineCard ||
    !featuredMagazineCover ||
    !featuredMagazineMeta ||
    !featuredMagazineTitle ||
    !featuredMagazineSummary
  ) {
    console.warn("No se encontró la tarjeta destacada del index.");
    return;
  }

  if (!magazine) {
    featuredMagazineTitle.textContent = "Todavía no hay revistas publicadas";
    featuredMagazineSummary.textContent = "Publica tu primera revista desde el panel editorial.";
    featuredMagazineMeta.textContent = "Sin publicaciones";
    featuredMagazineCard.href = "admin-revista.html";
    featuredMagazineCover.innerHTML = `<span>Sin portada</span>`;
    return;
  }

  const coverUrl = getCoverUrl(magazine.cover_image);

  featuredMagazineCard.href = `revista.html?slug=${encodeURIComponent(magazine.slug)}`;

  featuredMagazineMeta.textContent = `${magazine.edition_number} · ${magazine.category}`;
  featuredMagazineTitle.textContent = magazine.title;
  featuredMagazineSummary.textContent = magazine.summary;

  featuredMagazineCover.innerHTML = `
    <img 
      src="${coverUrl}" 
      alt="Portada ${normalizeText(magazine.title)}"
      loading="lazy"
    >
  `;
};

const createRecentCard = (magazine) => {
  const card = document.createElement("a");
  card.className = "article-card recent-magazine-card";
  card.href = `revista.html?slug=${encodeURIComponent(magazine.slug)}`;

  const coverUrl = getCoverUrl(magazine.cover_image);

  card.innerHTML = `
    <div class="article-image recent-magazine-cover">
      <img 
        src="${coverUrl}" 
        alt="Portada ${normalizeText(magazine.title)}"
        loading="lazy"
      >
    </div>

    <div class="article-content">
      <p class="article-meta">
        ${normalizeText(magazine.edition_number)} · ${normalizeText(magazine.category)}
      </p>

      <h3>${normalizeText(magazine.title)}</h3>

      <p>
        ${normalizeText(magazine.summary)}
      </p>

      <div class="article-footer">
        <span>${formatDate(magazine.publish_date)}</span>
        <span>Leer edición →</span>
      </div>
    </div>
  `;

  return card;
};

const renderRecentPublications = (magazines) => {
  if (!recentPublicationsGrid) {
    console.warn("No se encontró recentPublicationsGrid.");
    return;
  }

  recentPublicationsGrid.innerHTML = "";

  if (!Array.isArray(magazines) || magazines.length === 0) {
    recentPublicationsGrid.innerHTML = `
      <div class="empty-publications-card">
        <p class="article-meta">Sin publicaciones</p>
        <h3>Todavía no hay revistas publicadas</h3>
        <p>Cuando publiques una revista, aparecerá aquí automáticamente.</p>
      </div>
    `;
    return;
  }

  const latestThree = magazines.slice(0, 3);

  latestThree.forEach((magazine) => {
    const card = createRecentCard(magazine);
    recentPublicationsGrid.appendChild(card);
  });
};

const loadIndexMagazines = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/magazines`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las revistas");
    }

    const magazines = await response.json();

    renderFeaturedMagazine(magazines[0]);
    renderRecentPublications(magazines);
  } catch (error) {
    console.error("Error al cargar revistas en index:", error);

    if (
      featuredMagazineTitle &&
      featuredMagazineSummary &&
      featuredMagazineMeta &&
      featuredMagazineCover
    ) {
      featuredMagazineTitle.textContent = "No pudimos cargar la última revista";
      featuredMagazineSummary.textContent = "Revisa que el backend esté funcionando en localhost:3000.";
      featuredMagazineMeta.textContent = "Error de conexión";
      featuredMagazineCover.innerHTML = `<span>Error al cargar</span>`;
    }

    if (recentPublicationsGrid) {
      recentPublicationsGrid.innerHTML = `
        <div class="empty-publications-card">
          <p class="article-meta">Error</p>
          <h3>No se pudieron cargar las publicaciones recientes</h3>
          <p>Verifica que el servidor backend esté encendido.</p>
        </div>
      `;
    }
  }
};

loadIndexMagazines();