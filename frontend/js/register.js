const API_BASE_URL = window.API_BASE_URL || "https://potenzia24.com";

const registerForm = document.getElementById("registerForm");

const countrySelect = document.getElementById("idCountry");
const stateSelect = document.getElementById("idState");
const citySelect = document.getElementById("idCity");

const loadSelect = (select, items, placeholder) => {
  select.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.Id || item.id;
    option.textContent = item.Name || item.name;
    select.appendChild(option);
  });
};

const loadCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catalogs/countries`);
    const countries = await response.json();

    loadSelect(countrySelect, countries, "Seleccionar país");
  } catch (error) {
    console.error("Error al cargar países:", error);
  }
};

const loadStates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catalogs/states`);
    const states = await response.json();

    loadSelect(stateSelect, states, "Seleccionar estado");
  } catch (error) {
    console.error("Error al cargar estados:", error);
  }
};

const loadCities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catalogs/cities`);
    const cities = await response.json();

    loadSelect(citySelect, cities, "Seleccionar ciudad");
  } catch (error) {
    console.error("Error al cargar ciudades:", error);
  }
};

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);

  const payload = new FormData();

  payload.append("IdRol", formData.get("idRol"));
  payload.append("Email", formData.get("email"));
  payload.append("Password", formData.get("password"));
  payload.append("Name", formData.get("name"));
  payload.append("Lastname", formData.get("lastname"));
  payload.append("Age", formData.get("age"));
  payload.append("IdCity", formData.get("idCity"));
  payload.append("IdState", formData.get("idState"));
  payload.append("IdCountry", formData.get("idCountry"));

  const image = formData.get("image");

  if (image && image.size > 0) {
    payload.append("Image", image);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      body: payload,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "No se pudo registrar el usuario");
    }

    alert("Usuario registrado correctamente");

    window.location.href = "login.html";
  } catch (error) {
    console.error("Error registro:", error);
    alert(error.message || "Error al registrar usuario");
  }
});

loadCountries();
loadStates();
loadCities();