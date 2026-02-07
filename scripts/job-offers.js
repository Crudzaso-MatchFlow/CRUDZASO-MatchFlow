import { getCurrentUser, logout } from "./utils.js";


const API = "http://localhost:3000";


document.addEventListener("DOMContentLoaded", async () => {

  const currentUser = getCurrentUser();
  if (!currentUser) { // add
    window.location.href = "./../index.html"
    return;
  }


  const navSearchItem = document.getElementById("navSearchItem")
  const navOfferItem = document.getElementById("navOfferItem")
  const btnCreateOffer = document.getElementById("btnCreateOffer")

  if (currentUser.role === "company") {
    if (navSearchItem) navSearchItem.classList.remove("d-none")
    if (navOfferItem) navOfferItem.classList.remove("d-none")
    if (btnCreateOffer) btnCreateOffer.classList.remove("d-none")
  }


  const container = document.getElementById("job-offers-list");
  if (!container) return;

  try {
    const [offersRes, companiesRes] = await Promise.all([
      fetch(`${API}/jobOffers`),
      fetch(`${API}/companies`),
    ]);

    const jobOffers = await offersRes.json();
    const companies = await companiesRes.json();


    let visibleOffers = jobOffers;

    if (currentUser.role === "company") {
      const companyId = Number(currentUser.id);
      visibleOffers = jobOffers.filter(
        (o) => Number(o.companyId) === companyId
      );
    }

    if (!visibleOffers.length) {
      container.innerHTML = `<p>No hay ofertas para mostrar.</p>`;
      return;
    }

    container.innerHTML = visibleOffers
      .map((o) => {
        const company = companies.find(
          (c) => Number(c.id) === Number(o.companyId)
        );

        return `
       <div class="col-12 col-md-6 col-lg-4 mb-3">
  <article class="card shadow-sm border-0 h-100">
    <div class="card-body d-flex flex-column">

     
      <div class="d-flex align-items-start justify-content-between mb-2">

        <div class="d-flex align-items-center gap-3">
          <img
            src="${company?.avatar || 'https://ui-avatars.com/api/?name=Empresa'}"
            alt="${company?.name || 'Empresa'}"
            class="rounded"
            style="width:44px;height:44px;object-fit:cover;"
          />

          <div>
            <h6 class="mb-0 fw-semibold text-truncate">
              ${o.title}
            </h6>
            <small class="text-muted d-block">
              ${company ? company.name : "Empresa"}
            </small>
          </div>
        </div>

      </div>

     
      <div class="d-flex flex-wrap gap-2 mb-2">
        <span class="badge bg-light text-secondary border">${o.location}</span>
        <span class="badge bg-light text-secondary border">${o.typeContract}</span>
        <span class="badge bg-light text-secondary border">${o.mode}</span>
      </div>

     
      <p class="small text-muted mb-3 flex-grow-1 job-card-description">
        ${o.description}
      </p>

     
      <div class="d-flex justify-content-between align-items-center small pt-2 border-top">
        <span class="fw-semibold text-success">
          ${o.salary}
        </span>

        <span class="text-muted">
          ${new Date(o.deadline).toLocaleDateString()}
        </span>
      </div>

    </div>
  </article>
</div>`;
      })
      .join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>Error cargando ofertas.</p>`;
  }
})

window.logout = function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
};