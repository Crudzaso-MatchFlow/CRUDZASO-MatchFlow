import * as utils from "./utils.js"
const API = "http://localhost:3000";

document.addEventListener("click", async (e) => {
  if(e.target.dataset.action === "match"){
    const candidateId = e.target.dataset.candidateId;
    const currentUser = utils.getCurrentUser();
    const companyId = currentUser.id;
    if(!currentUser){
      utils.notify.error();
      return;
    }

    const offerId = localStorage.getItem("selectedOfferId");
    if(!offerId){
      utils.notify.toast("You must select a offer first");
      return;
    }

    // 
    const validation = await utils.canCrtReservation(candidateId, offerId);

    if (!validation.ok) {
      alert(validation.reason);
      return;
    }

    await utils.reserveCandidate(candidateId, companyId, offerId);
    await utils.createMatch(companyId, candidateId, offerId);

    utils.notify.confirm("Match Created Sucessfully");
  }
});


import { getSession } from "./utils.js";

const currentUser = getSession();

let actualCandidate = null; // add 
let actualCompany = null; // add 
let candidateId = null; // add
let candidates = []; // add 
let actualOffers = []; // add 
let offers = []; // add 

const candidatesEl = document.getElementById("candidatesEl");

function showError(msg) { // add 
  console.error(msg);
}

// cambie el nombre de los datos para que fuera mucho más legible

function candidateCard(candidate) {
  const badge = candidate.openToWork
    ? `<span class="badge text-bg-success">OpenToWork</span>`
    : `<span class="badge text-bg-danger">No disponible</span>`;

  const skills = (candidate.skills || [])
    .slice(0, 8)
    .map(
      (skill) =>
        `<span class="badge rounded-pill text-bg-light border me-1 mb-1 fw-normal">${skill}</span>`
    )
    .join("");
    
  const disabled = c.reservedBy ? "disabled" : "";
  const label = c.blocked ? "Subscription expired" : c.reservedBy ? "Reserved" : "Hacer match";
  return `
    <div class="col-12 col-lg-6">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex gap-3">
            <img
              src="${candidate.avatar}"
              alt="${candidate.name}"
              class="rounded-3"
              style="width:72px;height:72px;object-fit:cover;"
            />

            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <h5 class="card-title mb-1">${candidate.name}</h5>
                  <div class="text-muted small">
                    ${candidate.profession} • ${candidate.email}
                  </div>
                </div>
                <div>${badge}</div>
              </div>

              ${candidate.bio
      ? `<p class="card-text mt-3 mb-2">${candidate.bio}</p>`
      : `<p class="card-text mt-3 mb-2 text-muted">Sin bio.</p>`
    }

              <div class="mt-2">${skills}</div>
              
              <div class="d-flex gap-2 mt-3">
                <button
                  class="btn btn-primary btn-sm"
                  data-action="match"
                  data-candidate-id="${c.id}"
                  ${disabled}
                >
                  ${label}
                </button>
                <button
                  class="btn btn-outline-secondary btn-sm"
                  data-action="view"
                  data-candidate-id="${candidate.id}"
                >
                  Reservar
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
  const candidates = await res.json();
  const user = utils.getCurrentUser();
  const hasSub = await utils.hasActiveSubscription(user.id, user.rol)

  const processed = candidates.map(e => ({
    ...c,
    blocked: !hasSub
  }));
  if (!res.ok) {
    showError("Error cargando candidatos.");
    return;
  }
  renderCandidates(processed);
}

async function getCompanies() { // add - corregí el nombre 
  try {
    const res = await fetch(`${API}/companies`);
    const companiesArray = await res.json();
    return companiesArray || [];
  } catch (error) {
    console.error("Error loading companies:", error); // add
    return []; // add
  }
}

async function getOffers() {
  try {
    const res = await fetch(`${API}/jobOffers`);
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("Error loading offers:", error); // add
    return []; // add
  }
}

function formatDate(dateValue) { //add
  if (!dateValue) return "Sin fecha"; //add

  const date = new Date(dateValue); //add
  if (isNaN(date.getTime())) return "Fecha inválida"; //add

  return new Intl.DateTimeFormat("es-CO", { //add
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
  }).format(date);
}
// add - para fecha más bonita


function openMatchModal() { // add - función para abrir el modal
  const matchModal = document.getElementById("match-modal");

  matchModal.classList.remove("hidden");
  matchModal.classList.add("fixed", "inset-0", "z-50");

  matchModal.classList.add("bg-black/10");
}

function closeMatchModal() { // add 
  const matchModal = document.getElementById("match-modal");
  matchModal.classList.add("hidden");
}

async function saveMatch(match) { //add
  await fetch(`${API}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match),
  });
}


function renderOffers(list) { // add 
  const box = document.getElementById("tbody");
  box.innerHTML = "";

  list.forEach((offer) => {
    const row = createOfferRow(offer); // add 
    box.appendChild(row);
  });
}

function createOfferRow(offer) { // add 
  const row = document.createElement("tr");
  row.className = "border-t hover:bg-gray-50";
  row.dataset.id = offer.id;

  row.innerHTML = `
    <td class="px-6 py-4">
      <p>${offer.title}</p>
      <p class="text-sm text-gray-600">${offer.typeContract}</p>
    </td>

    <td class="px-6 py-4">
      <p>${offer.description}</p>
    </td>

    <td class="px-6 py-4">
      <p>${offer.location}</p>
      <p class="text-sm text-gray-600">${offer.mode}</p>
    </td>

    <td class="px-6 py-4">
      <p>${offer.salary}</p>
    </td>

    <td class="px-6 py-4">
      <p>${offer.deadline}</p>
    </td>

    <td class="px-6 py-4 text-center space-x-2">
      <button
        class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        data-action="accept-offer"
        data-offer-id="${offer.id}"
      >
        Match
      </button>
    </td>
  `;

  return row;
}


candidatesEl.addEventListener("click", (e) => { // add 
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  candidateId = btn.dataset.candidateId;

  if (action === "match") {
    openMatchModal();

    renderOffers(actualOffers);
  }

  if (action === "view") {

  }
});

// add 
document.getElementById("tbody").addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action='accept-offer']");
  if (!btn) return;

  const offerId = btn.dataset.offerId;

  // add - validaciones
  if (!actualCompany?.id) return;
  if (!candidateId) return;
  if (!offerId) return;

  const match = {
    companyId: actualCompany.id,
    candidateId: candidateId,
    jobOfferId: offerId,
    status: "pending",
    createdAt: Date.now(),
  };

  await saveMatch(match); // add 

  closeMatchModal(); // add 
});


(async function init() {
  if (!currentUser) { // add
    showError("No hay sesión activa.");
    window.location.href = "index.html"
    return;
  }

  if (currentUser.role !== "company") {
    window.location.href = "candidate.html"
  }

  const companies = await getCompanies(); // add - corregí nombre
  offers = await getOffers(); // add 

  await loadCandidates();

  actualCompany = companies.find((company) => company.id === currentUser.id); // add

  // add - hace que todos los ids sean strings para poderlos comparar correctamente
  actualOffers = offers.filter((offer) => String(offer.companyId) === String(actualCompany?.id)); //ad


})();
