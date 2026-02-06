const API_URL = 'http://localhost:3000/candidates';
let candidateId = localStorage.getItem('candidateId');

let currentCandidate = null;   // datos reales
let draftCandidate = null;     // copia editable
let profileModal = null;

document.addEventListener('DOMContentLoaded', async () => {
  const modalEl = document.getElementById('profileModal');
  if (modalEl && window.bootstrap) {
    profileModal = new bootstrap.Modal(modalEl);
  }

  await loadCandidate();
  setupEvents();
});

/* 
  EVENTS
*/

function setupEvents() {
  document.getElementById('editProfileBtn')?.addEventListener('click', openModal);
  document.getElementById('editProfileBtn2')?.addEventListener('click', openModal);
  document.getElementById('saveProfileBtn')?.addEventListener('click', saveProfile);
  document.getElementById('addSkillBtn')?.addEventListener('click', addSkill);
  document.getElementById('addLanguageBtn')?.addEventListener('click', addLanguage);
  document.getElementById('addExperienceBtn')?.addEventListener('click', addExperience);
  document.getElementById('openToWorkToggle')?.addEventListener('change', handleOpenToWork);
  document.getElementById('avatarEdit')?.addEventListener('click', () => {
    document.getElementById('photoInput')?.click();
  });
  document.getElementById('photoInput')?.addEventListener('change', handlePhotoUpload);
}

/* 
  LOAD CANDIDATE
*/

async function loadCandidate() {
  try {
    let res;

    if (candidateId) {
      res = await fetch(`${API_URL}/${candidateId}`);
    } else {
      res = await fetch(API_URL);
    }

    if (!res.ok) throw new Error('Error loading candidate');

    const data = await res.json();
    currentCandidate = Array.isArray(data) ? data[0] : data;

    candidateId = currentCandidate.id;
    localStorage.setItem('candidateId', candidateId);

    renderProfile(currentCandidate);
  } catch (err) {
    console.error(err);
  }
}

/* 
  RENDER PROFILE (VIEW)
*/

function renderProfile(data) {
  document.getElementById('profileName').textContent = data.name || '';
  document.getElementById('profileTitle').textContent = data.profession || '';
  document.getElementById('profileBio').textContent = data.bio || 'Tell us about yourself...';
  document.getElementById('profileEmail').textContent = data.email || 'N/A';
  document.getElementById('profilePhone').textContent = data.phone || 'N/A';
  const avatarUrl =
    data.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}`;

  document.getElementById('profileAvatar').src = avatarUrl;

  const sidebarAvatar = document.getElementById('user-avatar');
  const sidebarName = document.getElementById('user-name');

  if (sidebarAvatar) sidebarAvatar.src = avatarUrl;
  if (sidebarName) sidebarName.textContent = data.name || 'User';

  renderOpenToWork(data.openToWork);

  renderSkillBadges(data.skills || []);
  renderLanguagesView(data.languages || []);
  renderExperienceView(data.experience || []);
}


function renderSkillBadges(skills = []) {
  const el = document.getElementById('profileSkills');
  el.innerHTML = '';

  if (!skills.length) {
    el.textContent = 'Add your technical skills';
    return;
  }

  skills.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'badge bg-primary-subtle text-secondary me-2 mb-2';
    span.textContent = skill;
    el.appendChild(span);
  });
}

function renderLanguagesView(languages = []) {
  const el = document.getElementById('profileLanguages');
  el.innerHTML = '';

  if (!languages.length) {
    el.textContent = 'Add languages you speak';
    return;
  }

  languages.forEach(l => {
    el.innerHTML += `
      <div class="mb-2">
        <strong>${l.name}</strong> – ${l.level}
      </div>
    `;
  });
}

function renderExperienceView(exp = []) {
  const el = document.getElementById('profileExperience');
  el.innerHTML = '';

  if (!exp.length) {
    el.textContent = 'Add your professional experience';
    return;
  }

  exp.forEach(e => {
    el.innerHTML += `
      <div class="mb-3">
        <strong>${e.position}</strong> at ${e.company}<br>
        <em>${e.startDate} - ${e.endDate || 'Present'}</em>
        <p>${e.description}</p>
      </div>
    `;
  });
}

/* 
OPEN TO WORK
*/

function renderOpenToWork(open) {
  const badge = document.getElementById('openToWorkBadge');
  const toggle = document.getElementById('openToWorkToggle');

  if (!badge || !toggle) return;

  toggle.checked = !!open;

  if (open) {
    badge.textContent = 'Open to work';
    badge.className = 'badge bg-success mb-3';
  } else {
    badge.textContent = 'Not available';
    badge.className = 'badge bg-secondary mb-3';
  }
}

async function handleOpenToWork(e) {
  const value = e.target.checked;

  try {
    const updated = { ...currentCandidate, openToWork: value };

    const res = await fetch(`${API_URL}/${candidateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });

    if (!res.ok) throw new Error('Failed to update');

    currentCandidate.openToWork = value;
    renderOpenToWork(value);
  } catch (err) {
    console.error('Error updating Open to Work:', err);
    // Revertir el checkbox si falló
    e.target.checked = !value;
  }
}

/* 
  MODAL
*/

function openModal() {
  draftCandidate = structuredClone(currentCandidate);

  document.getElementById('modalName').value = draftCandidate.name || '';
  document.getElementById('modalProfession').value = draftCandidate.profession || '';
  document.getElementById('modalPhone').value = draftCandidate.phone || '';
  document.getElementById('modalEmail').value = draftCandidate.email || '';
  document.getElementById('modalBio').value = draftCandidate.bio || '';

  renderSkillsEditor();
  renderLanguagesEditor();
  renderExperienceEditor();

  profileModal.show();
}

/* 
  SKILLS
*/

function renderSkillsEditor() {
  const el = document.getElementById('skillsEditor');
  el.innerHTML = '';

  draftCandidate.skills.forEach((skill, index) => {
    const row = document.createElement('div');
    row.className = 'd-flex gap-2 mb-2';

    row.innerHTML = `
      <input class="form-control" value="${skill}">
      <button class="btn btn-outline-danger btn-sm">✕</button>
    `;

    row.querySelector('input').addEventListener('input', e => {
      draftCandidate.skills[index] = e.target.value;
    });

    row.querySelector('button').addEventListener('click', () => {
      draftCandidate.skills.splice(index, 1);
      renderSkillsEditor();
    });

    el.appendChild(row);
  });
}

function addSkill() {
  draftCandidate.skills.push('');
  renderSkillsEditor();
}

/* 
  LANGUAGES
*/

function renderLanguagesEditor() {
  const el = document.getElementById('languagesEditor');
  el.innerHTML = '';

  draftCandidate.languages.forEach((lang, index) => {
    const row = document.createElement('div');
    row.className = 'border p-2 mb-2';

    row.innerHTML = `
      <input class="form-control mb-2" placeholder="Language" value="${lang.name}">
      <input class="form-control mb-2" placeholder="Level (e.g., Native, Fluent)" value="${lang.level}">
      <button class="btn btn-outline-danger btn-sm">Remove</button>
    `;

    const inputs = row.querySelectorAll('input');
    inputs[0].addEventListener('input', e => draftCandidate.languages[index].name = e.target.value);
    inputs[1].addEventListener('input', e => draftCandidate.languages[index].level = e.target.value);

    row.querySelector('button').addEventListener('click', () => {
      draftCandidate.languages.splice(index, 1);
      renderLanguagesEditor();
    });

    el.appendChild(row);
  });
}

function addLanguage() {
  draftCandidate.languages.push({ name: '', level: '' });
  renderLanguagesEditor();
}

/*  
  EXPERIENCE
*/

function renderExperienceEditor() {
  const el = document.getElementById('experienceEditor');
  el.innerHTML = '';

  draftCandidate.experience.forEach((exp, index) => {
    const row = document.createElement('div');
    row.className = 'border p-3 mb-3';

    row.innerHTML = `
      <input class="form-control mb-2" placeholder="Position" value="${exp.position}">
      <input class="form-control mb-2" placeholder="Company" value="${exp.company}">
      <input class="form-control mb-2" placeholder="Start Date" value="${exp.startDate}">
      <input class="form-control mb-2" placeholder="End Date (or leave empty if current)" value="${exp.endDate || ''}">
      <textarea class="form-control mb-2" placeholder="Description" rows="3">${exp.description}</textarea>
      <button class="btn btn-outline-danger btn-sm">Remove</button>
    `;

    const inputs = row.querySelectorAll('input, textarea');
    inputs[0].addEventListener('input', e => exp.position = e.target.value);
    inputs[1].addEventListener('input', e => exp.company = e.target.value);
    inputs[2].addEventListener('input', e => exp.startDate = e.target.value);
    inputs[3].addEventListener('input', e => exp.endDate = e.target.value);
    inputs[4].addEventListener('input', e => exp.description = e.target.value);

    row.querySelector('button').addEventListener('click', () => {
      draftCandidate.experience.splice(index, 1);
      renderExperienceEditor();
    });

    el.appendChild(row);
  });
}

function addExperience() {
  draftCandidate.experience.push({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  renderExperienceEditor();
}

/* 
  PHOTO
*/

function handlePhotoUpload(e) {
  const file = e.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = async () => {
    document.getElementById('profileAvatar').src = reader.result;
    
    // Actualizar avatar
    try {
      const updated = { ...currentCandidate, avatar: reader.result };
      
      await fetch(`${API_URL}/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      currentCandidate.avatar = reader.result;
      
      // Actualizar sidebar también
      const sidebarAvatar = document.getElementById('user-avatar');
      if (sidebarAvatar) sidebarAvatar.src = reader.result;
      
    } catch (err) {
      console.error('Error uploading photo:', err);
    }
  };
  reader.readAsDataURL(file);
}

/* 
  SAVE
*/

async function saveProfile() {
  draftCandidate.name = document.getElementById('modalName').value.trim();
  draftCandidate.profession = document.getElementById('modalProfession').value.trim();
  draftCandidate.phone = document.getElementById('modalPhone').value.trim();
  draftCandidate.email = document.getElementById('modalEmail').value.trim();
  draftCandidate.bio = document.getElementById('modalBio').value.trim();

  try {
    const res = await fetch(`${API_URL}/${candidateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftCandidate)
    });

    if (!res.ok) throw new Error('Save failed');

    currentCandidate = structuredClone(draftCandidate);
    renderProfile(currentCandidate);
    draftCandidate = null;
    profileModal.hide();
  } catch (err) {
    console.error(err);
    alert('Error saving profile. Please try again.');
  }
}


window.logout = function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
};