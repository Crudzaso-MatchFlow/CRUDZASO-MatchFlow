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
    <div class="card">
        <div class="card-body">
            <h5>${plan.name}</h5>
            <p>Price: $${plan.price}</p>
            <p>Start: ${subscription.startedAt.split("T")[0]}</p>
            <p>Expires: ${subscription.expiresAt.split("T")[0]}</p>
            ${usageText}
            <a href="plans.html" class="btn btn-primary">Change plan</a>
        </div>
    </div>`;
}
loadSubscription();
