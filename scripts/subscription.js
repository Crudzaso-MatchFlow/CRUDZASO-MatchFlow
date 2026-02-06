import { getCurrentUser} from "./utils.js";
const API = "http://localhost:3000";
const user = getCurrentUser();

if(!user) {
    alert("You must be logged in");
    location.href = "../index.html";
}
const container = document.getElementById("subscriptionInfo");
async function loadSubscription(){
    const subRes = await fetch(`${API}/subscriptions?userId=${user.id}&rol=${user.rol}`);
    const subs = await subRes.json();
    if(subs.length === 0) {
        container.innerHTML = `
        <div class="alert alert-warning">
            Not active subscription.
            <a href="plans.html">Choose a</a>
        </div>`;
    return;
    }
    const subscription = subs[0]
    const planRes = await fetch(`${API}/plans?id=${subscription.planId}`);
    const plan = (await planRes.json())[0];
    let usageText = "";
    if(user.rol === "company" && plan.maxOffers){
        const offersRes = await fetch(`${API}/jobOffers?companyId=${user.id}`);
        const offers = await offersRes.json();
        usageText = `<p>Offers used: ${offers.length} / ${plan.maxOffers}</p>`;
    }

    if(user.rol === "candidate" && plan.maxReservations){
        const matchesRes = await fetch(`${API}/matches?companyId=${user.id}`);
        const matches = await matchesRes.json();
        usageText = `<p>Reservations used: ${matches.length} / ${plan.maxReservations}</p>`;
    }
    container.innerHTML = `
    <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
    <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-start">
        <div>
            <span class="badge bg-success-subtle text-success text-uppercase fw-bold mb-2 ls-1" style="font-size: 0.7rem;">
                Plan Actual
            </span>
            <h4 class="mb-0 fw-bold text-dark">${plan.name}</h4>
            <span class="text-muted small">Renovación automática</span>
        </div>
        <div class="text-end">
            <h3 class="mb-0 text-primary fw-bold">$${plan.price}</h3>
            <small class="text-muted">/periodo</small>
        </div>
    </div>

    <div class="card-body px-4 pt-4">
        <div class="bg-light rounded-3 p-3 mb-4 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <div class="icon-box bg-white text-primary shadow-sm rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>
                </div>
                <div>
                    <small class="text-muted d-block text-uppercase" style="font-size: 0.65rem;">Inicio</small>
                    <span class="fw-semibold text-dark">${subscription.startedAt.split("T")[0]}</span>
                </div>
            </div>
            
            <div class="text-muted opacity-25 mx-2">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>
            </div>

            <div>
                <small class="text-muted d-block text-uppercase text-end" style="font-size: 0.65rem;">Vence</small>
                <span class="fw-semibold text-danger">${subscription.expiresAt.split("T")[0]}</span>
            </div>
        </div>

        <div class="mb-4">
            <h6 class="text-muted text-uppercase small fw-bold mb-3">Estadísticas de Uso</h6>
            <div class="p-0">
                ${usageText}
            </div>
        </div>

        <a href="plans.html" class="btn btn-outline-primary w-100 py-2 fw-semibold rounded-pill hover-shadow">
            <svg class="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.5 0a.5.5 0 0 0 0 1H1v1h5.5a.5.5 0 0 0 0-1zM6 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5.5 5a.5.5 0 0 0 0 1h5.5a.5.5 0 0 0 0-1H5.5zM1 10a.5.5 0 0 0 0 1h14a.5.5 0 0 0 0-1H1z"/></svg>
            Cambiar o Mejorar Plan
        </a>
    </div>
</div>`
}
loadSubscription();
