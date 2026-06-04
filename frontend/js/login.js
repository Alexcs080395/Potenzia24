const API_BASE_URL = "https://potenzia24.com";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);

  const payload = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "No se pudo iniciar sesión");
    }

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));

    alert("Inicio de sesión correcto");

    window.location.href = "admin-control-revistas.html";
  } catch (error) {
    console.error("Error login:", error);
    alert(error.message || "Error al iniciar sesión");
  }
});