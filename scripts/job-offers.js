import { getSession } from "./utils.js";


const API = "http://localhost:3000";


document.addEventListener("DOMContentLoaded", async () => {

  const currentUser = getSession();
  if (!currentUser) { // add
    window.location.href = "./../index.html"
    return;
  }


const navSearchItem = document.getElementById("navSearchItem")
const navOfferItem = document.getElementById("navOfferItem")
const btnCreateOffer = document.getElementById("btnCreateOffer") 

if (currentUser.role === "company"){
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
          <article class="card job-offer-card">
            <div class="card-body">
              <h4>${o.title}</h4>
              <p>${o.profession} • ${company ? company.name : "Empresa"}</p>
            </div>
          </article>
        `;
      })
      .join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>Error cargando ofertas.</p>`;
  }
})