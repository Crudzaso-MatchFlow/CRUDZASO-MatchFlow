const API = "http://localhost:3000";
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("You must login.");
    location.href = "../index.html";
}

const plansContainer = document.getElementById("plansContainer");

async function loadPlans() {
    const res = await fetch(`${API}/plans?rol=${user.rol}`)
    const plans = await res.json();
    plansContainer.innerHTML = "";
    plans.forEach(plan => {
        plansContainer.innerHTML +=`
        <div class="col-md-4 mb-3">
            <div class="card h-100 shadow">
                <div class="card-header text-center fw-bold">${plan.name}</div>
                <div class="card-body">
                    <p>Price: $${plan.price}</p>
                    ${plan.maxReservations ? `<p>Reservations: ${plan.maxReservations}</p>` : ""}
                    ${plan.maxOffers ? `<p>Offers: ${plan.maxOffers}</p>` : ""}
                    <p>Filters: ${plan.filters ? "Yes" : "No"}</p>
                    <button class="btn btn-primary w-100" onclick="subscribe(${plan.id})">
                        Choose Plan
                    </button>
                </div>
            </div>
        </div>
    `;
    });
}
async function subscribe(planId) {
    const subscription = {
        userId: user.id,
        rol: user.rol,
        planId: planId,
        startedAt: new Date().toISOString(),
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        status: "active"
    };
    const existing = await fetch(`${API}/subscription?userId=${user.id}&rol=${user.rol}`);
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
    alert("Subscription updated");
    location.href = "subscription.html";
}
loadPlans();