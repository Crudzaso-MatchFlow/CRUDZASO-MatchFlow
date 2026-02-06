import { getCurrentUser } from "./utils.js";
import { notify } from "./utils.js";

const API_URL = 'http://localhost:3000/candidates';
let candidateId = getCurrentUser(candidateId);

let currentCandidate = null;
let profileModalInstance = null;

document.addEventListener('DOMContentLoaded', async () => {

  const modalEl = document.getElementById('profileModal');
  if (modalEl && window.bootstrap) {
    profileModalInstance = new bootstrap.Modal(modalEl);
  }

  await loadCandidate();
  setupEvents();
});

// ============================
// Events
// ============================

function setupEvents() {

  document.getElementById('editProfileBtn')?.addEventListener('click', openModal);
  document.getElementById('editProfileBtn2')?.addEventListener('click', openModal);

  document.getElementById('saveProfileBtn')?.addEventListener('click', saveProfile);
  document.getElementById('openToWorkToggle')?.addEventListener('change', toggleStatus);

  document.getElementById('avatarEdit')?.addEventListener('click', () =>
    document.getElementById('photoInput')?.click()
  );
  document.getElementById('photoInput')?.addEventListener('change', uploadPhoto);
}

// ============================
// Error UI
// ============================

function showProfileError(message) {
  const box = document.getElementById('profileError');
  if (!box) return;
  box.textContent = message;
  box.classList.remove('d-none');
}

function hideProfileError() {
  const box = document.getElementById('profileError');
  if (!box) return;
  box.classList.add('d-none');
}

// ============================
// Load candidate
// ============================

export async function loadCandidate() {
  try {
    hideProfileError();

    if (candidateId) {
      const res = await fetch(`${API_URL}/${candidateId}`);
      if (!res.ok) throw new Error('Candidate not found');

      const data = await res.json();
      currentCandidate = data;
      updateUI(data);
      return;
    }

    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Could not load candidates');

    const list = await res.json();
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error('No candidates available');
    }

    const first = list[0];
    candidateId = first.id;
    localStorage.setItem('candidateId', candidateId);

    currentCandidate = first;
    updateUI(first);
  } catch (err) {
    console.error(err);
    showProfileError('We couldn’t load your profile. Please refresh the page.');
  }
}

// ============================
// UI render
// ============================

function updateUI(data) {
  const name = data.name || 'User';

  const nameEl = document.getElementById('profileName');
  const titleEl = document.getElementById('profileTitle');
  const bioEl = document.getElementById('profileBio');
  const skillsEl = document.getElementById('profileSkills');
  const languagesEl = document.getElementById('profileLanguages');
  const expEl = document.getElementById('profileExperience');
  const toggleEl = document.getElementById('openToWorkToggle');
  const phoneEl = document.getElementById('profilePhone');
  const emailEl = document.getElementById('profileEmail');

  // Sidebar footer
  const sidebarAvatar = document.getElementById('user-avatar');
  const sidebarName = document.getElementById('user-name');
  const sidebarRole = document.getElementById('user-role');

  if (sidebarAvatar) sidebarAvatar.src = data.avatar || 'https://via.placeholder.com/40?text=%3F';
  if (sidebarName) sidebarName.textContent = name;
  if (sidebarRole) sidebarRole.textContent = 'Candidate';

  if (nameEl) nameEl.textContent = name;
  if (titleEl) titleEl.textContent = data.profession || '';
  if (bioEl) bioEl.textContent = data.bio || 'No bio available.';
  if (phoneEl) phoneEl.textContent = data.phone || 'N/A';
  if (emailEl) emailEl.textContent = data.email || 'N/A';

  // Skills
  if (skillsEl) {
    skillsEl.textContent = '';
    if (Array.isArray(data.skills) && data.skills.length > 0) {
      data.skills.forEach((skill) => {
        const span = document.createElement('span');
        span.classList.add('badge', 'text-secondary', 'bg-primary-subtle', 'me-2', 'mb-2');
        span.textContent = skill;
        skillsEl.appendChild(span);
      });
    } else {
      skillsEl.textContent = 'Add your technical skills';
    }
  }

  // Languages
  if (languagesEl) {
    languagesEl.textContent = '';
    if (Array.isArray(data.languages) && data.languages.length > 0) {
      data.languages.forEach((lang) => {
        const div = document.createElement('div');
        div.classList.add('mb-2', 'text-start');
        div.innerHTML = `
          <h6 class="mb-1 fw-bold">${lang.name || ''}</h6>
          <p class="mb-0">Proficiency: ${lang.level || ''}</p>
        `;
        languagesEl.appendChild(div);
      });
    } else {
      languagesEl.textContent = 'Add languages you speak';
    }
  }

  // Experience
  if (expEl) {
    expEl.textContent = '';
    if (Array.isArray(data.experience) && data.experience.length > 0) {
      data.experience.forEach((exp) => {
        const div = document.createElement('div');
        div.classList.add('mb-3', 'text-start');
        div.innerHTML = `
          <h6 class="mb-1 fw-bold">${exp.position || ''} at ${exp.company || ''}</h6>
          <p class="mb-0"><em>${exp.startDate || ''} - ${exp.endDate || 'Present'}</em></p>
          <p class="mb-0">${exp.description || ''}</p>
        `;
        expEl.appendChild(div);
      });
    } else {
      expEl.textContent = 'Add your professional experience';
    }
  }

  // Toggle + badge
  if (toggleEl) toggleEl.checked = !!data.openToWork;

  const badge = document.getElementById('openToWorkBadge');
  if (badge) {
    if (data.openToWork) {
      badge.textContent = 'Open to Work';
      badge.classList.remove('bg-secondary');
      badge.classList.add('bg-success');
    } else {
      badge.textContent = 'Not available';
      badge.classList.remove('bg-success');
      badge.classList.add('bg-secondary');
    }
  }

  updateAvatar(name, data.avatar);
}

// ============================
// Avatar
// ============================

function updateAvatar(name, avatarUrl) {
  const finalUrl = avatarUrl
    ? avatarUrl
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=137fec&color=fff&size=140`;

  const mainAvatar = document.getElementById('profileAvatar');
  const topAvatar = document.getElementById('topAvatar');
  const topName = document.getElementById('topName');

  if (mainAvatar) mainAvatar.src = finalUrl;
  if (topAvatar) topAvatar.src = finalUrl;
  if (topName) topName.textContent = name;
}

// ============================
// Modal (Bootstrap)
// ============================

function openModal() {
  if (!currentCandidate) return;

  document.getElementById('modalName').value = currentCandidate.name || '';
  document.getElementById('modalProfession').value = currentCandidate.profession || '';
  document.getElementById('modalPhone').value = currentCandidate.phone || '';
  document.getElementById('modalEmail').value = currentCandidate.email || '';

  profileModalInstance?.show();
}

function closeModal() {
  profileModalInstance?.hide();
}

// ============================
// Save profile
// ============================

async function saveProfile() {
  const form = document.getElementById('profileForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!candidateId || !currentCandidate) {
    notify.error("candidate not loaded");
    return;
  }

  const updatedCandidate = {
    ...currentCandidate,
    name: document.getElementById('modalName').value.trim(),
    profession: document.getElementById('modalProfession').value.trim(),
    phone: document.getElementById('modalPhone').value.trim(),
    email: document.getElementById('modalEmail').value.trim(),
    openToWork: document.getElementById('openToWorkToggle').checked
  };

  try {
    const res = await fetch(`${API_URL}/${candidateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCandidate)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const updated = await res.json();
    currentCandidate = updated;
    updateUI(updated);
    closeModal();
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Error saving profile');
  }
}

// ============================
// Toggle status
// ============================

async function toggleStatus() {
  if (!candidateId || !currentCandidate) return;

  const isOpen = document.getElementById('openToWorkToggle').checked;

  const updated = {
    ...currentCandidate,
    openToWork: isOpen
  };

  try {
    const res = await fetch(`${API_URL}/${candidateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    currentCandidate = updated;
    updateUI(updated);
  } catch (error) {
    console.error('Error toggling status:', error);
  }
}

// ============================
// Upload photo 
// ============================

function uploadPhoto(e) {
  const file = e.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = document.getElementById('profileAvatar');
    if (img) img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}


window.logout = function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
};