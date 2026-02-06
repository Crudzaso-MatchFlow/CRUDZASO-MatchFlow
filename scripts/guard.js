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

// Requieres ADMIN
function requireAdmin() {
    const session = getSession();

    if (!session || session.role !== "admin") {
        window.location.href = "login.html";
    }
}

// Requieres USER
function requireUser() {
    const session = getSession();

    if (!session || session.role !== "user") {
        window.location.href = "login.html";
    }
}


