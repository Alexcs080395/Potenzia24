(() => {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const apiBaseUrl = isLocal ? "http://localhost:3000" : "https://potenzia24.com";

  window.API_BASE_URL = apiBaseUrl;
  window.POTENZIA_API_BASE_URL = apiBaseUrl;
})();
