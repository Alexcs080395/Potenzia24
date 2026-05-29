const form = document.getElementById("magazineForm");
const coverInput = document.getElementById("coverImage");
const coverPreview = document.getElementById("coverPreview");
const saveDraftBtn = document.getElementById("saveDraftBtn");

let selectedStatus = "published";

coverInput.addEventListener("change", () => {
  const file = coverInput.files[0];

  if (!file) return;

  const imageUrl = URL.createObjectURL(file);

  coverPreview.innerHTML = `
    <img src="${imageUrl}" alt="Vista previa de portada">
  `;
  
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
    sections: [
      {
        order: 1,
        key: "tema-mes",
        name: "Tema del mes",
        title: formData.get("sectionTitle1"),
        content: formData.get("sectionContent1"),
      },
      {
        order: 2,
        key: "creatividad-digital",
        name: "Creatividad digital",
        title: formData.get("sectionTitle2"),
        content: formData.get("sectionContent2"),
      },
      {
        order: 3,
        key: "automatizacion",
        name: "Automatización",
        title: formData.get("sectionTitle3"),
        content: formData.get("sectionContent3"),
      },
      {
        order: 4,
        key: "code-without-fear",
        name: "Code Without Fear",
        title: formData.get("sectionTitle4"),
        content: formData.get("sectionContent4"),
      },
      {
        order: 5,
        key: "herramienta-del-mes",
        name: "Herramienta del mes",
        title: formData.get("sectionTitle5"),
        content: formData.get("sectionContent5"),
      },
      {
        order: 6,
        key: "hecho-en-mx",
        name: "Hecho en MX",
        title: formData.get("sectionTitle6"),
        content: formData.get("sectionContent6"),
      },
      {
        order: 7,
        key: "entrevista-24",
        name: "Entrevista 24",
        title: formData.get("sectionTitle7"),
        content: formData.get("sectionContent7"),
      },
      {
        order: 8,
        key: "human-os",
        name: "Human OS",
        title: formData.get("sectionTitle8"),
        content: formData.get("sectionContent8"),
      },
    ],
  };

  const payload = new FormData();

  payload.append("magazine", JSON.stringify(magazineData));
  payload.append("coverImage", coverInput.files[0]);

  try {
  const response = await fetch("http://localhost:3000/api/magazines", {
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
  window.location.href = `revista.html?slug=${result.slug}`;
}

selectedStatus = "published";

} catch (error) {
  console.error(error);
  alert("No se pudo publicar la revista. Revisa el servidor.");
}
});