const API_BASE_URL =
  window.POTENZIA_API_BASE_URL ||
  window.API_BASE_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://potenzia24.com");

const form = document.getElementById("magazineForm");
const coverInput = document.getElementById("coverImage");
const coverPreview = document.getElementById("coverPreview");
const saveDraftBtn = document.getElementById("saveDraftBtn");

let selectedStatus = "published";

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

coverInput.addEventListener("change", () => {
  const file = coverInput.files[0];
  if (!file) return;

  const imageUrl = URL.createObjectURL(file);
  coverPreview.innerHTML = `<img src="${imageUrl}" alt="Vista previa de portada">`;
});

if (saveDraftBtn) {
  saveDraftBtn.addEventListener("click", () => {
    selectedStatus = "draft";
    form.requestSubmit();
  });
}

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
    status: selectedStatus,
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
    const response = await fetch(`${API_BASE_URL}/api/magazines`, {
      method: "POST",
      body: payload,
    });

    if (!response.ok) {
      throw new Error("Error al publicar la revista");
    }

    const result = await response.json();

    if (selectedStatus === "draft") {
      alert("Revista guardada como borrador");
      window.location.href = "admin-control-revistas.html";
    } else {
      alert("Revista publicada correctamente");
      window.location.href = `../client-pages/revista.html?slug=${encodeURIComponent(result.slug || magazineData.slug)}`;
    }
  } catch (error) {
    console.error(error);
    alert("No se pudo guardar la revista. Revisa el servidor.");
  } finally {
    selectedStatus = "published";
  }
});
