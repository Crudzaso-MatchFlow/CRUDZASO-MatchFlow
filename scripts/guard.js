// SESSION MANAGEMENT


// Get sesion
function getSession() {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
}


// ROUTE GUARDS


// Requieres sesión
function requireAuth() {
    const session = getSession();
    if (!session) {
        window.location.href = "login.html";
    }
}

// Requieres Company
function requireCompany() {
    const session = getSession();

    if (!session || session.rol !== "company") {
        window.location.href = "login.html";
    }
}

// Requieres candidate
function requireCandidate() {
    const session = getSession();

    if (!session || session.rol !== "candidate") {
        window.location.href = "login.html";
    }
}


