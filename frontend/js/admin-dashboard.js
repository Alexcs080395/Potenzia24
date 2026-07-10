const API_BASE_URL =
  window.POTENZIA_API_BASE_URL ||
  window.API_BASE_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://potenzia24.com");

const getCoverUrl = (coverImage) => {
  if (!coverImage) return "";
  if (coverImage.startsWith("http")) return coverImage;
  return `${API_BASE_URL}${coverImage}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusLabel = (status) => {
  const labels = {
    published: "Publicada",
    draft: "Borrador",
    scheduled: "Programada",
  };
  return labels[status] || status || "Sin estatus";
};

const getStatusClass = (status) => {
  const classes = {
    published: "status-published",
    draft: "status-draft",
    scheduled: "status-scheduled",
  };
  return classes[status] || "";
};

const getPublicMagazineUrl = (slug) => `../client-pages/revista.html?slug=${encodeURIComponent(slug || "")}`;

const totalMagazines = document.getElementById("totalMagazines");
const publishedMagazines = document.getElementById("publishedMagazines");
const draftMagazines = document.getElementById("draftMagazines");
const scheduledMagazines = document.getElementById("scheduledMagazines");
const latestMagazineState = document.getElementById("latestMagazineState");
const latestMagazineCard = document.getElementById("latestMagazineCard");
const latestMagazineCover = document.getElementById("latestMagazineCover");
const latestMagazineCategory = document.getElementById("latestMagazineCategory");
const latestMagazineTitle = document.getElementById("latestMagazineTitle");
const latestMagazineSummary = document.getElementById("latestMagazineSummary");
const latestMagazineRead = document.getElementById("latestMagazineRead");
const latestMagazineEdit = document.getElementById("latestMagazineEdit");
const recentMagazinesState = document.getElementById("recentMagazinesState");
const recentMagazinesTable = document.getElementById("recentMagazinesTable");
const recentMagazinesBody = document.getElementById("recentMagazinesBody");

const sortByRecentDate = (items) => [...items].sort((a, b) => {
  const dateA = new Date(a.publish_date || a.created_at || 0).getTime();
  const dateB = new Date(b.publish_date || b.created_at || 0).getTime();
  return dateB - dateA;
});

const renderStats = (magazines) => {
  const published = magazines.filter((item) => item.status === "published");
  const drafts = magazines.filter((item) => item.status === "draft");
  const scheduled = magazines.filter((item) => item.status === "scheduled");

  totalMagazines.textContent = magazines.length;
  publishedMagazines.textContent = published.length;
  draftMagazines.textContent = drafts.length;
  scheduledMagazines.textContent = scheduled.length;
};

const renderLatestMagazine = (magazines) => {
  const latestPublished = sortByRecentDate(
    magazines.filter((item) => item.status === "published")
  )[0];

  if (!latestPublished) {
    latestMagazineState.textContent = "Todavía no hay revistas publicadas.";
    latestMagazineCard.style.display = "none";
    return;
  }

  latestMagazineState.style.display = "none";
  latestMagazineCard.style.display = "grid";

  latestMagazineCover.innerHTML = latestPublished.cover_image
    ? `<img src="${getCoverUrl(latestPublished.cover_image)}" alt="Portada de ${latestPublished.title || "revista"}">`
    : `<span>Sin portada</span>`;

  latestMagazineCategory.textContent = latestPublished.category || "Potenzia24";
  latestMagazineTitle.textContent = latestPublished.title || "Revista publicada";
  latestMagazineSummary.textContent = latestPublished.summary || latestPublished.edition_number || "Edición publicada en Potenzia24.";
  latestMagazineRead.href = getPublicMagazineUrl(latestPublished.slug);
  latestMagazineEdit.href = `admin-editar-revista.html?id=${latestPublished.id}`;
};

const renderRecentMagazines = (magazines) => {
  const recent = sortByRecentDate(magazines).slice(0, 6);

  if (!recent.length) {
    recentMagazinesState.textContent = "Todavía no hay actividad reciente.";
    recentMagazinesTable.style.display = "none";
    return;
  }

  recentMagazinesBody.innerHTML = "";

  recent.forEach((magazine) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <strong>${magazine.title || "Sin título"}</strong>
        <span>${magazine.edition_number || "Sin edición"}</span>
      </td>
      <td>${magazine.category || "Sin categoría"}</td>
      <td>${formatDate(magazine.publish_date)}</td>
      <td><span class="status-pill ${getStatusClass(magazine.status)}">${getStatusLabel(magazine.status)}</span></td>
      <td><a class="btn-table" href="admin-editar-revista.html?id=${magazine.id}">Editar</a></td>
    `;
    recentMagazinesBody.appendChild(row);
  });

  recentMagazinesState.style.display = "none";
  recentMagazinesTable.style.display = "table";
};

const loadDashboard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/magazines`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las revistas");
    }

    const magazines = await response.json();
    const safeMagazines = Array.isArray(magazines) ? magazines : [];

    renderStats(safeMagazines);
    renderLatestMagazine(safeMagazines);
    renderRecentMagazines(safeMagazines);
  } catch (error) {
    console.error(error);
    latestMagazineState.textContent = "Error al cargar la información del dashboard.";
    recentMagazinesState.textContent = "Error al cargar la actividad reciente.";
  }
};

loadDashboard();
