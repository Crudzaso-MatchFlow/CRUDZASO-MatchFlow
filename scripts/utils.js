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
export async function canCrtReservation(candidateId, jobOfferId) {
    const user = getCurrentUser();

    const candidateRes = await fetch(`${API_URL}/candidates/${candidateId}`);
    const candidate = await candidateRes.json();
    const planRes = await fetch(`${API_URL}/plans?id=${subscription.planId}`);
    const plan = (await planRes.json())[0];
    if (!subs.length){
        return {ok: false, reason: "Not active subscription"}
    }
    const subscription = subs[0];
    
    
    if (!candidate.reservedBy) {
        return { ok: false, reason: "Candidate is already reserved or not available." };
    }

    const matchesRes = await fetch(`${API_URL}/matches?jobOfferId=${jobOfferId}`);
    const matches = await matchesRes.json();

    if (matches.length > 0) {
        return { ok: false, reason: "Job offer already has a reservation." };
    }

    return { ok: true };
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
export async function canCrtOffer(companyId) {
    const subRes = await fetch(`${API_URL}/subscriptions?userId=${companyId}&rol=company`);
    const subs = await subRes.json();
    if (!subs.length) return { ok: false, reason: "No active subscription" };
    const subscription = subs[0]
    if (!isSubscriptionActive(subscription)) {
        return { ok: false, reason: "Your subscription is expired" };
    }
    const planRes = await fetch(`${API_URL}/plans?id=${subs[0].planId}`);
    const plan = (await planRes.json())[0];
    const offersRes = await fetch(`${API_URL}/jobOffers?companyId=${companyId}`);
    const offers = await offersRes.json();
    if (offers.length >= plan.maxOffers) {
        return { ok: false, reason: "Offer limit reached for your plan" };
    }
    return { ok: true };
}


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

//subscription functions...
export function isSubscriptionActive(subscription) {
    const now = new Date();
    const expires = new Date(subscription.expiresAt);
    return subscription.status === "active" && expires > now;
}
export async function hasActiveSubscription(userId, rol) {
    const res = await fetch(`${API_URL}/subscriptions?userId=${userId}&rol=${rol}`);
    const subs = await res.json();

    if (!subs.length) return false;

    const sub = subs[0];
    return isSubscriptionActive(sub);
}



// Notify alerts sweetAlert2

export const notify = {
    // 1. (Success)
    success: (title, text = "") => {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            padding: '2rem',
            color: '#1a1a1a',
            iconColor: '#28a745', // Verde Bootstrap
            customClass: {
                popup: 'rounded-4 shadow-lg'
            }
        });
    },

    // 2. (error)
    error: (title, text = "Something went wrong, try again.") => {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonColor: '#dc3545',
            padding: '2rem',
            customClass: {
                popup: 'rounded-4'
            }
        });
    },

    // 3.(confirmation) for change plan
    confirm: async (title, text, confirmButtonText = "Sí, continuar") => {
        const result = await Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd', // Azul Bootstrap
            cancelButtonColor: '#6c757d',
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar',
            reverseButtons: true, // Pone el botón de cancelar a la izquierda
            padding: '2rem',
            customClass: {
                popup: 'rounded-4'
            }
        });
        return result.isConfirmed;
    },

    // 4. Toast
    toast: (title, icon = 'info') => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
        Toast.fire({
            icon: icon,
            title: title
        });
    }
};