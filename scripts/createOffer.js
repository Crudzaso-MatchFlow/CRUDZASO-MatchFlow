import * as utils from "./utils.js"

let form = document.getElementById('formCreateOffer');
const titleOffer = document.getElementById('titleOffer');
const descriptionOffer = document.getElementById('descriptionOffer');
const professionOffer = document.getElementById('professionOffer');
const typeContract = document.getElementById('typeContract');
const locationOffer = document.getElementById('locationOffer');
const modeOffer = document.getElementById('modeOffer');
const salaryOffer = document.getElementById('salaryOffer');
const deadlineOffer = document.getElementById('deadlineOffer');
let submitBtn = document.getElementById('submitBtn');
let cancelBtn = document.getElementById('cancelBtn');
const user = utils.getCurrentUser();

// block visual 
(async function checkSubscription() {
    const hasSub = await utils.hasActiveSubscription(user.id, user.rol);

    if (!hasSub) {
        form.innerHTML = `
        <div class="alert alert-danger">
            Your subscription is expired or inactive.
            <a href="plans.html">Renew your plan</a>
        </div>`;
    }
})();

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const validation = await utils.canCrtOffer(user.id);

    if(!validation.ok){
        alert(validation.reason);
        return;
    }

    const newOffer = {
        companyId: "",
        title: titleOffer.value,
        description: descriptionOffer.value,
        profession: professionOffer.value,
        typeContract: typeContract.value,
        location: locationOffer.value,
        mode: modeOffer.value,
        salary: salaryOffer.value,
        deadline: deadlineOffer.value,
        createdAt: new Date().toISOString(),
        isActive: true
    }

    await fetch('http://localhost:3000/jobOffers', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newOffer)
    });

    utils.notify.error("offer created succesfully");
    form.reset();
});