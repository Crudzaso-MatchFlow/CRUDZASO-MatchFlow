import * as utils from "./utils.js"
const API = "http://localhost:3000";

document.addEventListener("click", async (e) => {
  if(e.target.dataset.action === "match"){
    const candidateId = e.target.dataset.candidateId;
    const currentUser = utils.getCurrentUser();
    const companyId = currentUser.id;

    const offerId = localStorage.getItem("selectedOfferId");

    // 
    const validation = await utils.canCrtReservation(candidateId, offerId);

    if (!validation.ok) {
      alert(validation.reason);
      return;
    }

    await utils.reserveCandidate(candidateId, companyId, offerId);
    await utils.createMatch(companyId, candidateId, offerId);

    alert("Match created successfully!");
  }
});



function candidateCard(c) {
  const badge = c.openToWork
    ? `<span class="badge text-bg-success">OpenToWork</span>`
    : `<span class="badge text-bg-danger">No disponible</span>`;

  const skills = (c.skills || [])
    .slice(0, 8)
    .map(
      (s) =>
        `<span class="badge rounded-pill text-bg-light border me-1 mb-1 fw-normal">${s}</span>`
    )
    .join("");

  return `
    <div class="col-12 col-lg-6">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex gap-3">
            <img
              src="${c.avatar}"
              alt="${c.name}"
              class="rounded-3"
              style="width:72px;height:72px;object-fit:cover;"
            />

            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <h5 class="card-title mb-1">${c.name}</h5>
                  <div class="text-muted small">
                    ${c.profession} • ${c.email}
                  </div>
                </div>
                <div>${badge}</div>
              </div>

              ${
                c.bio
                  ? `<p class="card-text mt-3 mb-2">${c.bio}</p>`
                  : `<p class="card-text mt-3 mb-2 text-muted">Sin bio.</p>`
              }

              <div class="mt-2">${skills}</div>

              <div class="d-flex gap-2 mt-3">
                <button
                  class="btn btn-primary btn-sm"
                  data-action="match"
                  data-candidate-id="${c.id}"
                >
                  Hacer match
                </button>
                <button
                  class="btn btn-outline-secondary btn-sm"
                  data-action="view"
                  data-candidate-id="${c.id}"
                >
                  Ver perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCandidates(list) {
  if (!list.length) {
    candidatesEl.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning mb-0">No hay candidatos para mostrar.</div>
      </div>`;
    return;
  }
  candidatesEl.innerHTML = list.map(candidateCard).join("");
}



async function loadCandidates() {


  const res = await fetch(`${API}/candidates`);
  if (!res.ok) {
    showError("Error cargando candidatos.");
    return;
  }

  let candidates = await res.json()


  renderCandidates(candidates);
}

// init
(async function init() {
  await loadCandidates();
})();
