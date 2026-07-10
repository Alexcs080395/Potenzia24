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

const adminState = document.getElementById("adminMagazinesState");
const adminTable = document.getElementById("adminMagazinesTable");
const adminBody = document.getElementById("adminMagazinesBody");

const loadAdminMagazines = async () => {
  try {
    adminState.style.display = "block";
    adminState.textContent = "Cargando revistas...";
    adminTable.style.display = "none";
    adminBody.innerHTML = "";

    const response = await fetch(`${API_BASE_URL}/api/admin/magazines`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las revistas");
    }

    const magazines = await response.json();

    if (!Array.isArray(magazines) || magazines.length === 0) {
      adminState.textContent = "Todavía no hay revistas registradas.";
      return;
    }

    magazines.forEach((magazine) => {
      const row = document.createElement("tr");
      const canViewPublic = magazine.status === "published" && magazine.slug;

      row.innerHTML = `
        <td>
          ${
            magazine.cover_image
              ? `<img class="admin-cover-thumb" src="${getCoverUrl(magazine.cover_image)}" alt="Portada de ${magazine.title || "revista"}">`
              : `<div class="admin-cover-thumb"></div>`
          }
        </td>
        <td>
          <strong>${magazine.title || "Sin título"}</strong>
          <span>${magazine.edition_number || "Sin edición"}</span>
          <small>${magazine.slug || "Sin slug"}</small>
        </td>
        <td>${magazine.category || "Sin categoría"}</td>
        <td>${formatDate(magazine.publish_date)}</td>
        <td><span class="status-pill ${getStatusClass(magazine.status)}">${getStatusLabel(magazine.status)}</span></td>
        <td>
          <div class="admin-actions">
            ${
              canViewPublic
                ? `<a class="btn-table" href="${getPublicMagazineUrl(magazine.slug)}" target="_blank" rel="noopener">Ver</a>`
                : `<button class="btn-table" disabled>No visible</button>`
            }
            <button class="btn-table" onclick="changeStatus(${magazine.id}, 'published')">Publicar</button>
            <button class="btn-table" onclick="changeStatus(${magazine.id}, 'draft')">Borrador</button>
            <button class="btn-table" onclick="changeStatus(${magazine.id}, 'scheduled')">Programar</button>
            <a class="btn-table" href="admin-editar-revista.html?id=${magazine.id}">Editar</a>
            <button class="btn-table danger" onclick="deleteMagazine(${magazine.id})">Eliminar</button>
          </div>
        </td>
      `;

      adminBody.appendChild(row);
    });

    adminState.style.display = "none";
    adminTable.style.display = "table";
  } catch (error) {
    console.error(error);
    adminState.textContent = "Error al cargar las revistas. Revisa la conexión con el backend.";
  }
};

const changeStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/magazines/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar el estatus");
    }

    await loadAdminMagazines();
  } catch (error) {
    console.error(error);
    alert("Error al cambiar estatus.");
  }
};

const deleteMagazine = async (id) => {
  const confirmDelete = confirm("¿Seguro que deseas eliminar esta revista? Esta acción no se puede deshacer.");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/magazines/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar la revista");
    }

    await loadAdminMagazines();
  } catch (error) {
    console.error(error);
    alert("Error al eliminar revista.");
  }
};

window.changeStatus = changeStatus;
window.deleteMagazine = deleteMagazine;

loadAdminMagazines();
