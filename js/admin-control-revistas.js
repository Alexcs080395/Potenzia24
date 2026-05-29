const API_BASE_URL = "http://localhost:3000";

const adminState = document.getElementById("adminMagazinesState");
const adminTable = document.getElementById("adminMagazinesTable");
const adminBody = document.getElementById("adminMagazinesBody");

const getCoverUrl = (coverImage) => {
  if (!coverImage) return "";

  if (coverImage.startsWith("http")) {
    return coverImage;
  }

  return `${API_BASE_URL}${coverImage}`;
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

const getStatusLabel = (status) => {
  const labels = {
    published: "Publicada",
    draft: "Borrador",
    scheduled: "Programada",
  };

  return labels[status] || status;
};

const getStatusClass = (status) => {
  const classes = {
    published: "status-published",
    draft: "status-draft",
    scheduled: "status-scheduled",
  };

  return classes[status] || "";
};

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

      const canViewPublic = magazine.status === "published";

      row.innerHTML = `
        <td>
          <img 
            class="admin-cover-thumb" 
            src="${getCoverUrl(magazine.cover_image)}" 
            alt="Portada de ${magazine.title}"
          >
        </td>

        <td>
          <strong>${magazine.title}</strong>
          <span>${magazine.edition_number}</span>
          <small>${magazine.slug}</small>
        </td>

        <td>${magazine.category}</td>

        <td>${formatDate(magazine.publish_date)}</td>

        <td>
          <span class="status-pill ${getStatusClass(magazine.status)}">
            ${getStatusLabel(magazine.status)}
          </span>
        </td>

        <td>
          <div class="admin-actions">
            ${
              canViewPublic
                ? `<a class="btn-table" href="revista.html?slug=${encodeURIComponent(magazine.slug)}" target="_blank">Ver</a>`
                : `<button class="btn-table" disabled>No visible</button>`
            }

            <button class="btn-table" onclick="changeStatus(${magazine.id}, 'published')">
              Publicar
            </button>

            <button class="btn-table" onclick="changeStatus(${magazine.id}, 'draft')">
              Borrador
            </button>

            <button class="btn-table" onclick="changeStatus(${magazine.id}, 'scheduled')">
              Programar
            </button>
           
            <a class="btn-table" href="admin-editar-revista.html?id=${magazine.id}">
              Editar
            </a>

            <button class="btn-table danger" onclick="deleteMagazine(${magazine.id})">
              Eliminar
            </button>
            
          </div>
        </td>
      `;

      adminBody.appendChild(row);
    });

    adminState.style.display = "none";
    adminTable.style.display = "table";
  } catch (error) {
    console.error(error);
    adminState.textContent = "Error al cargar las revistas.";
  }
};

const changeStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/magazines/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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
  const confirmDelete = confirm(
    "¿Seguro que deseas eliminar esta revista? Esta acción no se puede deshacer."
  );

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

loadAdminMagazines();