
const AUTH_API = "http://localhost:5000/api/auth";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const authMessage = document.getElementById("authMessage");

// Switch to Login form
function showLogin() {
    loginForm.style.display = "block";
    registerForm.style.display = "none";

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    authMessage.textContent = "";
}

// Switch to Register form
function showRegister() {
    loginForm.style.display = "none";
    registerForm.style.display = "block";

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    authMessage.textContent = "";
}

// Register new user
registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await fetch(`${AUTH_API}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        authMessage.textContent = "Registration successful! Please login.";
        authMessage.style.color = "green";

        registerForm.reset();
        showLogin();

    } catch (error) {
        authMessage.textContent = error.message;
        authMessage.style.color = "red";
    }
});

// Login existing user
loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${AUTH_API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        authMessage.textContent = "Login successful!";
        authMessage.style.color = "green";

        window.location.href = "index.html";

    } catch (error) {
        authMessage.textContent = error.message;
        authMessage.style.color = "red";
    }
});
