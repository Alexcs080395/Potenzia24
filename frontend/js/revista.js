const API_BASE_URL = "http://localhost:3000";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const magazineLoading = document.getElementById("magazineLoading");
const magazineError = document.getElementById("magazineError");
const issueHero = document.getElementById("issueHero");
const issueLayout = document.getElementById("issueLayout");

const magazineEdition = document.getElementById("magazineEdition");
const magazineTitle = document.getElementById("magazineTitle");
const magazineSummary = document.getElementById("magazineSummary");
const magazineDate = document.getElementById("magazineDate");
const magazineSectionsCount = document.getElementById("magazineSectionsCount");
const magazineCategory = document.getElementById("magazineCategory");
const magazineCover = document.getElementById("magazineCover");

const sectionsNav = document.getElementById("sectionsNav");
const sectionsContent = document.getElementById("sectionsContent");

const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";

  const date = new Date(dateString);

  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const createSectionId = (section) => {
  if (section.section_key) return section.section_key;

  return `seccion-${section.section_order}`;
};

const showError = () => {
  magazineLoading.style.display = "none";
  magazineError.style.display = "block";
  issueHero.style.display = "none";
  issueLayout.style.display = "none";
};

const showMagazine = () => {
  magazineLoading.style.display = "none";
  magazineError.style.display = "none";
  issueHero.style.display = "grid";
  issueLayout.style.display = "grid";
};

const loadMagazine = async () => {
  if (!slug) {
    showError();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/magazines/${slug}`);

    if (!response.ok) {
      throw new Error("No se encontró la revista");
    }

    const magazine = await response.json();

    document.title = `${magazine.title} | FACTOR 24`;

    magazineEdition.textContent = `${magazine.edition_number} · ${magazine.category}`;
    magazineTitle.textContent = magazine.title;
    magazineSummary.textContent = magazine.summary;
    magazineDate.textContent = formatDate(magazine.publish_date);
    magazineSectionsCount.textContent = `${magazine.sections.length} secciones`;
    magazineCategory.textContent = magazine.category;

    magazineCover.src = `${API_BASE_URL}${magazine.cover_image}`;
    magazineCover.alt = `Portada ${magazine.title}`;

    sectionsNav.innerHTML = "";
    sectionsContent.innerHTML = "";

    magazine.sections.forEach((section) => {
      const sectionId = createSectionId(section);

      const navLink = document.createElement("a");
      navLink.href = `#${sectionId}`;
      navLink.textContent = `${String(section.section_order).padStart(2, "0")}. ${section.section_name}`;
      sectionsNav.appendChild(navLink);

      const sectionElement = document.createElement("section");
      sectionElement.classList.add("issue-section");
      sectionElement.id = sectionId;

      sectionElement.innerHTML = `
        <p class="article-meta">
          ${String(section.section_order).padStart(2, "0")} · ${section.section_name}
        </p>

        <h2>${section.section_title}</h2>

        ${formatContent(section.section_content)}
      `;

      sectionsContent.appendChild(sectionElement);
    });

    showMagazine();
  } catch (error) {
    console.error("Error al cargar revista:", error);
    showError();
  }
};

const formatContent = (content) => {
  if (!content) return "<p>Sin contenido.</p>";

  const paragraphs = content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
};

loadMagazine();