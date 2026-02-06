import { getCurrentUser } from "./utils.js";

// Helpers

async function getAllUsers() {
    const [candidates, companies] = await Promise.all([
        fetch(`http://localhost:3000/candidates`).then(response => response.json()),
        fetch(`http://localhost:3000/companies`).then(response => response.json())
    ]);

    return [...candidates, ...companies];
}

// Sign up

async function createUser(newUser) {
    const users = await getAllUsers();

    const exists = users.some(user => user.email === newUser.email);
    if (exists) {
        throw new Error('Email already exists');
    }

    const endpoint = newUser.role === 'company' ? 'companies' : 'candidates';

    const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });

    return response.json();
}

// Login

async function loginUser(email, password) {
    const users = await getAllUsers();

    return users.find(user => user.email === email && user.password === password);
}


// Events

document.addEventListener('DOMContentLoaded', () => {

    const currentUser = getCurrentUser();

    if (currentUser) {
        console.log(JSON.stringify(currentUser.role))

        if (currentUser.role === "company") { // add
            window.location.href = "company.html"
        } else {
            window.location.href = "candidate.html"
        }
    }

    // Sigup
    const signupForm = document.getElementById('signup-form');
    const signupError = document.getElementById('signup-error');
    const signupSuccess = document.getElementById('signup-success');
    const signupName = document.getElementById('signup-name');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const signupRole = document.getElementById('signup-role');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        signupError.classList.add('d-none');
        signupSuccess.classList.add('d-none');

        const newUser = {
            name: signupName.value.trim(),
            email: signupEmail.value.trim().toLowerCase(),
            password: signupPassword.value,
            role: signupRole.value
        };

        try {
            await createUser(newUser);
            signupSuccess.classList.remove('d-none');
            signupForm.reset();
        } catch (error) {
            signupError.textContent = error.message;
            signupError.classList.remove('d-none');
        }
    });

    // Login
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        loginError.classList.add('d-none');

        const user = await loginUser(
            loginEmail.value.trim().toLowerCase(),
            loginPassword.value
        );

        if (!user) {
            loginError.classList.remove('d-none');
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));

        window.location.href =
            user.role === 'company' ? 'company.html' : 'candidate.html';
    });
});


