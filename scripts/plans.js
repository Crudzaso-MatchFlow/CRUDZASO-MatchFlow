import { getCurrentUser } from "./utils.js";
import { notify } from "./utils.js";
const API = "http://localhost:3000";
const user = getCurrentUser();

if (!user) {
    notify.error();
    location.href = "../index.html";
}

const plansContainer = document.getElementById("plansContainer");

async function loadPlans() {
    const res = await fetch(`${API}/plans?rol=${user.rol}`)
    const plans = await res.json();
    plansContainer.innerHTML = "";
    plansContainer.innerHTML = plans.map(plan => `
        <div class="col-md-4 mb-4">
    <div class="card h-100 border-0 shadow-sm hover-top transition-all">
        <div class="card-body p-4 d-flex flex-column">
            
            <div class="text-center mb-4">
                <h5 class="text-uppercase text-muted fw-bold small ls-1">${plan.name}</h5>
                <div class="d-flex justify-content-center align-items-baseline my-3">
                    <span class="h2 fw-bold align-self-start me-1">$</span>
                    <span class="display-4 fw-bold text-primary">${plan.price}</span>
                    </div>
            </div>

            <ul class="list-unstyled mb-4 flex-grow-1">
                ${plan.maxReservations ? `
                <li class="mb-3 d-flex align-items-center">
                    <span class="badge bg-success-subtle text-success rounded-circle p-1 me-2">
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                    </span>
                    <span><strong>${plan.maxReservations}</strong> Reservaciones</span>
                </li>` : ""}

                ${plan.maxOffers ? `
                <li class="mb-3 d-flex align-items-center">
                    <span class="badge bg-success-subtle text-success rounded-circle p-1 me-2">
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                    </span>
                    <span><strong>${plan.maxOffers}</strong> Ofertas</span>
                </li>` : ""}

                <li class="mb-3 d-flex align-items-center">
                    <span class="badge ${plan.filters ? 'bg-primary-subtle text-primary' : 'bg-secondary-subtle text-secondary'} rounded-circle p-1 me-2">
                        ${plan.filters 
                            ? `<svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>` 
                            : `<svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/></svg>`
                        }
                    </span>
                    <span class="${plan.filters ? '' : 'text-muted'}">
                        Filtros: ${plan.filters ? "Incluidos" : "No incluidos"}
                    </span>
                </li>
            </ul>

            <button 
                class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm"
                data-action="subscribe"
                data-plan-id="${plan.id}">
                Elegir Plan
            </button>
        </div>
    </div>
</div>
    `).join("");
}
plansContainer.addEventListener("click", async (e) => {
    if (e.target.dataset.action === "subscribe") {
        const planId = e.target.dataset.planId;
        const subscription = {
            userId: user.id,
            rol: user.rol,
            planId: planId,
            startedAt: new Date().toISOString(),
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            status: "active"
        };
    const existing = await fetch(`${API}/subscriptions?userId=${user.id}&rol=${user.rol}`);
    const data = await existing.json();
    if (data.length > 0){
        await fetch(`${API}/subscriptions/${data[0].id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription)
        });
    } else {
        await fetch(`${API}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription)
        });
    }
    notify.success("Subscription Updated");
    window.location.href = "../pages/subscription.html";
    }
});

loadPlans();