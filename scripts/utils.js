// ================================
// MatchFlow - Utilidades Compartidas
// ================================

const API_URL = 'http://localhost:3000';

// Cargar datos del servidor
export async function loadFromDB(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        if (!response.ok) throw new Error(`Error loading ${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${endpoint}:`, error);
        return null;
    }
}

// Guardar datos al servidor (PATCH para actualizar)
export async function saveToDB(endpoint, id, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Error saving ${endpoint}/${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Error saving ${endpoint}/${id}:`, error);
        return null;
    }
}

// Crear nuevo recurso
export async function createInDB(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Error creating ${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error(`Error creating ${endpoint}:`, error);
        return null;
    }
}

// Eliminar recurso
export async function deleteFromDB(endpoint, id) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Error deleting ${endpoint}/${id}`);
        return true;
    } catch (error) {
        console.error(`Error deleting ${endpoint}/${id}:`, error);
        return false;
    }
}

// ================================
// Gestión de Sesión
// ================================

export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

export function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'pages/login.html';
}

// ================================
// Funciones de Caching
// ================================

export function cacheData(key, data) {
    localStorage.setItem(`matchflow_${key}`, JSON.stringify({
        data: data,
        timestamp: Date.now()
    }));
}

export function getCachedData(key, maxAge = 5 * 60 * 1000) { // 5 minutos por defecto
    const cached = localStorage.getItem(`matchflow_${key}`);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(`matchflow_${key}`);
        return null;
    }
    return data;
}

// ================================
// Funciones de Usuario (Candidato)
// ================================

export async function updateCandidateOpenToWork(candidateId, openToWork) {
    return await saveToDB('candidates', candidateId, { openToWork });
}

export async function reserveCandidate(candidateId, companyId, offerId) {
    return await saveToDB('candidates', candidateId, {
        reservedBy: companyId,
        reservedForOffer: offerId
    });
}

export async function releaseReservation(candidateId) {
    return await saveToDB('candidates', candidateId, {
        reservedBy: null,
        reservedForOffer: null
    });
}

// ================================
// Funciones de Matches
// ================================

export async function createMatch(companyId, candidateId, jobOfferId) {
    const newMatch = {
        companyId: parseInt(companyId),
        candidateId: parseInt(candidateId),
        jobOfferId: parseInt(jobOfferId),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    return await createInDB('matches', newMatch);
}

export async function updateMatchStatus(matchId, status) {
    return await saveToDB('matches', matchId, { status });
}

// ================================
// Funciones de Ofertas
// ================================

export async function createJobOffer(offerData) {
    return await createInDB('jobOffers', {
        ...offerData,
        createdAt: new Date().toISOString(),
        isActive: true
    });
}

export async function updateJobOffer(offerId, data) {
    return await saveToDB('jobOffers', offerId, data);
}

// ================================
// Utilidades de UI
// ================================

export function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function getStatusBadge(status) {
    const statusConfig = {
        pending: { class: 'bg-warning', text: 'Pendiente' },
        contacted: { class: 'bg-info', text: 'Contactado' },
        interview: { class: 'bg-primary', text: 'Entrevista' },
        hired: { class: 'bg-success', text: 'Contratado' },
        discarded: { class: 'bg-danger', text: 'Descartado' }
    };

    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return `<span class="badge ${config.class}">${config.text}</span>`;
}

export function getOpenToWorkBadge(openToWork) {
    return openToWork
        ? '<span class="badge bg-success">Open to Work</span>'
        : '<span class="badge bg-secondary">Busy</span>';
}

export function getSession() { // add
    const session = localStorage.getItem("currentUser");
    return session ? JSON.parse(session) : null;
}
