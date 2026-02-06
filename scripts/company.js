import { getCurrentUser } from "./utils.js";
import { notify } from "./utils.js";

const API_URL = 'http://localhost:3000/companies';
let companyId = null;

// guards
let didInit = false;
let isCreatingCompany = false;
let hasAttemptedCreate = false;



document.addEventListener('DOMContentLoaded', async () => {
  if (didInit) return; // prevents double init in some setups
  didInit = true;

  await loadCompany();
  setupEvents();
});

function setupEvents() {
  // Defensive: don't crash if an element doesn't exist (crashes can trigger reload loops)
  document.getElementById('editProfileBtnInline')?.addEventListener('click', openModal);

  document.getElementById('closeModal')?.addEventListener('click', closeModal);
  document.getElementById('cancelBtn')?.addEventListener('click', closeModal);
  document.getElementById('saveProfileBtn')?.addEventListener('click', saveProfile);
  

  document.getElementById('avatarEdit')?.addEventListener('click', () =>
    document.getElementById('photoInput')?.click()
  );
  document.getElementById('photoInput')?.addEventListener('change', uploadPhoto);

  const modal = document.getElementById('profileModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'profileModal') closeModal();
    });
  }
}

/* Function to load company */
async function loadCompany() {
  try {
    const user = getCurrentUser();
    console.log("CURRENT USER =>", user);

    if (!user) {
      window.location.href = "../pages/login.html";
      return;
    }

    if (user.role !== "company") {
      window.location.href = "../pages/candidate.html";
      return;
    }

    companyId = String(user.id);

    
    const res = await fetch(`${API_URL}/${companyId}`);
    if (!res.ok) {
      console.error("Error loading company:", res.status);
      return;
    }

    const company = await res.json();
    updateUI(company);

  } catch (err) {
    console.error("loadCompany failed:", err);
    notify.error?.("Error inesperado cargando la compañía.");
  }
}


/* Update User Inteface  */
function updateUI(data) {
  document.getElementById('companyName').textContent = data.name || 'Your Company Name';
  document.getElementById('companyIndustry').textContent = data.industry || 'Industry';

  /* No theres data */
/*   document.getElementById('companySize').textContent = data.size || 'Company Size';
  document.getElementById('companyLocation').textContent = data.location || 'Location'; */

  document.getElementById('companyPhone').textContent = `Cel: (${data.phone})` || '+57 ...';
  document.getElementById('companyEmail').textContent = `Email: ${data.email}` || 'email@company.com';
  document.getElementById('companyDescription').textContent = data.description || 'Add a description about your company...';

  const contacts = document.getElementById('companyContacts');
  if (contacts) {
    if (data.phone || data.email || data.website) contacts.classList.remove('hidden');
  }

  updateAvatar(data.name || 'Company');
}

/* Function updateAvatar */
function updateAvatar(name) {
  const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&size=140`;
  document.getElementById('profileAvatar').src = url;
  document.getElementById('topAvatar').src = url;
  document.getElementById('topName').textContent = name;
}

/* Function to openModal */
async function openModal() {
  document.getElementById('profileModal').classList.add('active');

  await fetch(`${API_URL}/${companyId}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById('modalName').value = data.name || '';
      document.getElementById('modalIndustry').value = data.industry || '';

      // Documentated by stteen
/*       document.getElementById('modalSize').value = data.size || ''; */

      document.getElementById('modalLocation').value = data.location || '';
      document.getElementById('modalPhone').value = data.phone || '';
      document.getElementById('modalEmail').value = data.email || '';
      document.getElementById('modalWebsite').value = data.website || '';
      document.getElementById('modalDescription').value = data.description || '';
    });
}

/* Function to closeModal */
function closeModal() {
  document.getElementById('profileModal').classList.remove('active');
}

/* Function to save profile */
async function saveProfile() {
  const form = document.getElementById('profileForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!companyId) {
    notify.error("company not loaded");
    return;
  }

  const data = {
    id: companyId,
    name: document.getElementById('modalName').value.trim() || 'Your Company Name',
    industry: document.getElementById('modalIndustry').value.trim() || 'Industry',
    size: document.getElementById('modalSize').value || '',
    location: document.getElementById('modalLocation').value.trim() || 'Location',
    phone: document.getElementById('modalPhone').value.trim() || '',
    email: document.getElementById('modalEmail').value.trim() || 'email@company.com',
    website: document.getElementById('modalWebsite').value.trim() || '',
    description: document.getElementById('modalDescription').value.trim() || 'Add a description about your company...',
  };

  try {
    const res = await fetch(`${API_URL}/${companyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const updated = await res.json();
    updateUI(updated);
    closeModal();
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving: ' + error.message);
  }
}

/* Function to update image */
function uploadPhoto(e) {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('profileAvatar').src = e.target.result;
    document.getElementById('topAvatar').src = e.target.result;
  };
  reader.readAsDataURL(file);
}


/* <-------------- ** SECTION STTEEN MODIFIED **   ----------------> */
/* Function to loggout */
window.logout = function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = '../pages/login.html';
};