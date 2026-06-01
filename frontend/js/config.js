const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://potenzia24.com";

window.API_BASE_URL = API_BASE_URL;