// scripts/components/Sidebar.js
import { getSession, logout } from '../utils.js';

export function renderSidebar() {
    const user = getSession();
    if (!user) return ''; // No hay sidebar si no hay login

    const menuItems = {
        candidate: [
            { label: 'Perfil', hash: '#/dashboard', icon: 'person' },
            { label: 'Planes', hash: '#/plans', icon: 'payments' },
            { label: 'Mis Matches', hash: '#/matches', icon: 'favorite' }
        ],
        company: [
            { label: 'Perfil Empresa', hash: '#/dashboard', icon: 'business' },
            { label: 'Crear Oferta', hash: '#/create-offer', icon: 'add_circle' },
            { label: 'Buscar Candidatos', hash: '#/search', icon: 'search' },
            { label: 'Suscripción', hash: '#/subscription', icon: 'stars' }
        ]
    };

    const items = menuItems[user.rol] || [];

    return `
        <div class="sidebar-header p-3">
            <h4 class="text-primary fw-bold">MatchFlow</h4>
            <small class="badge bg-light text-primary">${user.rol.toUpperCase()}</small>
        </div>
        <nav class="nav flex-column p-2">
            ${items.map(item => `
                <a href="${item.hash}" class="nav-link d-flex align-items-center gap-2">
                    <span class="material-symbols-outlined">${item.icon}</span>
                    ${item.label}
                </a>
            `).join('')}
            <hr>
            <button id="logoutBtn" class="btn btn-link text-danger nav-link d-flex align-items-center gap-2">
                <span class="material-symbols-outlined">logout</span>
                Cerrar Sesión
            </button>
        </nav>
    `;
}

// Función para asignar el evento de logout después de renderizar
export function initSidebarEvents() {
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}