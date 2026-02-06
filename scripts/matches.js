import { getCurrentUser } from "./utils.js";


const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {

  const currentUser = getCurrentUser();

  if (!currentUser) { // add
    showError("No hay sesión activa.");
    window.location.href = "index.html"
    return;
  }

  if (currentUser.role !== "company") { // add
    window.location.href = "candidate.html"
  }

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const candidateId = user?.id;

  const grid = document.getElementById("cards-grid");
  const matchesCount = document.getElementById("matches-count");
  const resultsCount = document.getElementById("results-count");

  if (!candidateId) {
    grid.innerHTML = "<p>No hay usuario logueado</p>";
    return;
  }


  const matches = await fetch(`${API}/matches?candidateId=${candidateId}`).then(r => r.json());

  matchesCount.textContent = matches.length;
  resultsCount.textContent = matches.length;

  if (!matches.length) {
    grid.innerHTML = "<p>No tienes matches aún</p>";
    return;
  }


  grid.innerHTML = "";
  for (const m of matches) {
    const offer = await fetch(`${API}/jobOffers/${m.jobOfferId}`).then(r => r.json());
    const company = await fetch(`${API}/companies/${offer.companyId}`).then(r => r.json());

    const card = document.createElement("div");
    card.className = "card p-3 shadow-sm border-0";

    card.innerHTML = `
      <div class="d-flex gap-3 align-items-start">
        <img src="${company.avatar}" width="56" height="56" style="border-radius:12px;object-fit:cover" />
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="mb-1">${offer.title}</h5>
              <div class="text-muted">${company.name} • ${offer.profession}</div>
            </div>
            <span class="badge bg-secondary">${m.status}</span>
          </div>

          <div class="mt-2 text-muted" style="font-size:.95rem">
            ${offer.location} • ${offer.mode} • ${offer.salary}
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  }
});

// opcional (por si tu sidebar lo llama)
function logout() {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const profileLink = document.getElementById("profile-link");
  const user = JSON.parse(localStorage.getItem("user")); //

  if (!profileLink) return;

  if (!user?.rol) {
    profileLink.href = "../index.html"; // o login
    return;
  }

  if (user.rol === "candidate") profileLink.href = "candidate.html";
  else if (user.rol === "company") profileLink.href = "company.html";
});
