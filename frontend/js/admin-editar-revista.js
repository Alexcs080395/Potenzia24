const API_BASE_URL = "https://potenzia24.com";

const params = new URLSearchParams(window.location.search);
const magazineId = params.get("id");

const form = document.getElementById("editMagazineForm");
const coverInput = document.getElementById("coverImage");
const coverPreview = document.getElementById("coverPreview");

const sectionKeys = [
  "tema-mes",
  "creatividad-digital",
  "automatizacion",
  "code-without-fear",
  "herramienta-del-mes",
  "hecho-en-mx",
  "entrevista-24",
  "human-os",
];

const sectionNames = [
  "Tema del mes",
  "Creatividad digital",
  "Automatización",
  "Code Without Fear",
  "Herramienta del mes",
  "Hecho en MX",
  "Entrevista 24",
  "Human OS",
];

const getCoverUrl = (coverImage) => {
  if (!coverImage) return "";

  if (coverImage.startsWith("http")) {
    return coverImage;
  }

  return `${API_BASE_URL}${coverImage}`;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

coverInput.addEventListener("change", () => {
  const file = coverInput.files[0];

  if (!file) return;

  const imageUrl = URL.createObjectURL(file);

  coverPreview.innerHTML = `
    <img src="${imageUrl}" alt="Vista previa de portada">
  `;
});

const fillForm = (magazine) => {
  form.editionNumber.value = magazine.edition_number || "";
  form.publishDate.value = formatDateForInput(magazine.publish_date);
  form.status.value = magazine.status || "draft";
  form.category.value = magazine.category || "";
  form.title.value = magazine.title || "";
  form.slug.value = magazine.slug || "";
  form.summary.value = magazine.summary || "";

  if (magazine.cover_image) {
    coverPreview.innerHTML = `
      <img src="${getCoverUrl(magazine.cover_image)}" alt="Portada actual">
    `;
  }

  for (let i = 1; i <= 8; i++) {
    const section = magazine.sections.find(
      (item) => Number(item.section_order) === i
    );

    const titleInput = form[`sectionTitle${i}`];
    const contentTextarea = form[`sectionContent${i}`];

    if (section) {
      titleInput.value = section.section_title || "";
      contentTextarea.value = section.section_content || "";
    }
  }
};

const loadMagazine = async () => {
  if (!magazineId) {
    alert("No se recibió el ID de la revista.");
    window.location.href = "admin-control-revistas.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/magazines/${magazineId}`);

    if (!response.ok) {
      throw new Error("No se pudo cargar la revista");
    }

    const magazine = await response.json();

    fillForm(magazine);
  } catch (error) {
    console.error(error);
    alert("Error al cargar la revista.");
    window.location.href = "admin-control-revistas.html";
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const magazineData = {
    editionNumber: formData.get("editionNumber"),
    publishDate: formData.get("publishDate"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    summary: formData.get("summary"),
    status: formData.get("status"),
    sections: [],
  };

  for (let i = 1; i <= 8; i++) {
    magazineData.sections.push({
      order: i,
      key: sectionKeys[i - 1],
      name: sectionNames[i - 1],
      title: formData.get(`sectionTitle${i}`),
      content: formData.get(`sectionContent${i}`),
    });
  }

  const payload = new FormData();

  payload.append("magazine", JSON.stringify(magazineData));

  if (coverInput.files[0]) {
    payload.append("coverImage", coverInput.files[0]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/magazines/${magazineId}`, {
      method: "PUT",
      body: payload,
    });

    if (!response.ok) {
      throw new Error("No se pudieron guardar los cambios");
    }

    const result = await response.json();

    alert("Revista actualizada correctamente");

    if (result.status === "published") {
      window.location.href = `revista.html?slug=${encodeURIComponent(result.slug)}`;
    } else {
      window.location.href = "admin-control-revistas.html";
    }
  } catch (error) {
    console.error(error);
    alert("Error al guardar cambios. Revisa el servidor.");
  }
});

loadMagazine();