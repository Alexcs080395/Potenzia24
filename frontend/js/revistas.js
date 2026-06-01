const API_BASE_URL = "https://potenzia24.com";

const magazinesGrid = document.getElementById("magazinesGrid");
const magazinesLoading = document.getElementById("magazinesLoading");
const magazinesError = document.getElementById("magazinesError");
const magazinesEmpty = document.getElementById("magazinesEmpty");

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

  return String(text)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const getCoverUrl = (coverImage) => {
  if (!coverImage) return "";

  if (coverImage.startsWith("http")) {
    return coverImage;
  }

  return `${API_BASE_URL}${coverImage}`;
};

const createMagazineCard = (magazine) => {
  const card = document.createElement("a");
  card.className = "magazine-published-card";
  card.href = `revista.html?slug=${encodeURIComponent(magazine.slug)}`;

  const coverUrl = getCoverUrl(magazine.cover_image);

  card.innerHTML = `
    <div class="magazine-published-cover">
      <img 
        src="${coverUrl}" 
        alt="Portada ${normalizeText(magazine.title)}"
        loading="lazy"
      >
    </div>

    <div class="magazine-published-content">
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
    magazinesLoading.style.display = "block";
    magazinesError.style.display = "none";
    magazinesEmpty.style.display = "none";
    magazinesGrid.innerHTML = "";

    const response = await fetch(`${API_BASE_URL}/api/magazines`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las revistas");
    }

    const magazines = await response.json();

    magazinesLoading.style.display = "none";

    if (!Array.isArray(magazines) || magazines.length === 0) {
      magazinesEmpty.style.display = "flex";
      return;
    }

    magazines.forEach((magazine) => {
      const card = createMagazineCard(magazine);
      magazinesGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar revistas:", error);

    magazinesLoading.style.display = "none";
    magazinesError.style.display = "block";
  }
};

loadMagazines();