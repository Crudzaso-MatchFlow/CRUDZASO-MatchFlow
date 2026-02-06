const API = "http://localhost:3000";
const user = JSON.parse(localStorage.getItem("user"));

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
            <a href="plans.html">Elegir plan</a>
        </div>`;
    return;
    }
    const subscription = subs[0]
    const planRes = await fetch(`${API}/plans?id=${subscription.planId}`);
    const plan = (await planRes.json())[0];
    container.innerHTML = `
    <div class="card">
        <div class="card-body">
            <h5>${plan.name}</h5>
            <p>Precio: $${plan.price}</p>
            <p>Inicio: ${subscription.startedAt.split("T")[0]}</p>
            <p>Vence: ${subscription.expiresAt.split("T")[0]}</p>
            <a href="plans.html" class="btn btn-primary">Cambiar plan</a>
        </div>
    </div>`;
}
loadSubscription();
