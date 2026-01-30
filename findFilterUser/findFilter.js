const url = "http://localhost:3000/candidates";

async function filterSearch() {
  const viewResultados = document.querySelector(".resultados");
  const formFilter = document.querySelector("#formFilter");
  const searchInput = document.querySelector("#search");

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);

    const dataResp = await resp.json();
    const candidates = dataResp.candidates || dataResp;

    function renderResults(filtered) {
      if (filtered.length === 0) {
        viewResultados.innerHTML = `<p>No hay resultados que cumplan los filtros</p>`;
      } else {
        viewResultados.innerHTML = filtered
          .map(
            (e) => `
          <div class="card mb-3 col-md-5 m-2">
            <h6 class="card-title m-3">Candidate</h6>
            <div class="card-body">
              <h6 class="card-subtitle">${e.name}</h6>
              <div class="row align-top">
                <div class="col-md-6">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3SwwQp_JZ1vjxqXeC6Oikp-TLWUWzSSR9hQ&s" alt="perfil" class="img-thumbnail mt-3" />
                </div>
                <div class="col-md-6">
                  <p class="text-end text">${e.profession}</p>
                </div>
              </div>
              <p class="card-text mt-3">${e.bio}</p>
              <button class="btn btn-primary">Math</button>
            </div>
          </div>
        `,
          )
          .join("");
      }
    }

    function applyFilters() {
      const categorias = [];
      if (document.getElementById("frontend").checked)
        categorias.push("frontend");
      if (document.getElementById("backend").checked)
        categorias.push("backend");
      if (document.getElementById("fullstack").checked)
        categorias.push("full stack");

      const searchText = searchInput.value.toLowerCase().trim();

      let filtered = candidates;

      // Filtrar por categorías
      if (categorias.length > 0) {
        filtered = filtered.filter((c) =>
          categorias.some((cat) => c.profession.toLowerCase().includes(cat)),
        );
      }

      // Filtrar por barra de búsqueda
      if (searchText) {
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(searchText) ||
            c.profession.toLowerCase().includes(searchText),
        );
      }

      renderResults(filtered);
    }

    // Eventos
    formFilter.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFilters();
    });

    searchInput.addEventListener("input", applyFilters);

    // Render inicial
    renderResults(candidates);
  } catch (error) {
    console.error(error);
  }
}

filterSearch();
