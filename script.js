/**
 * User constructor function. */
function User(password) {
    this.password = password;
    /**
     * @type {Array<{word: string, difficulty: string, score: number}>}
     */
    this.scores = []; // Will store objects with game details
    this.averageScore = 0;
}

/* SIGN UP */
function signup() {
    const signupUsernameInput = document.getElementById("signup-username");
    const signupPasswordInput = document.getElementById("signup-password");
    const signupMessage = document.getElementById("signup-message");

    const username = signupUsernameInput.value;
    const password = signupPasswordInput.value;

    // Clear previous messages
    signupMessage.textContent = "";

    // Username validation: must be at least 3 characters
    if (username.length < 3) {
        signupMessage.textContent = "(Username must be at least 3 characters)";
        return;
    }

    // Password validation: must contain uppercase, lowercase, and a number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        signupMessage.textContent = "(Password needs an uppercase, lowercase, and a number)";
        return;
    }

    // Check if user already exists (after validation passes)
    const storedUsername = username.toUpperCase();
    if (localStorage.getItem(storedUsername) != null) {
        signupMessage.textContent = "(User is Already Registered)"
    } else {
        const newUser = new User(password);
        localStorage.setItem(storedUsername, JSON.stringify(newUser));
        signupMessage.innerHTML = "(User Registered Successfully)";
    }

    signupUsernameInput.value = "";
    signupPasswordInput.value = "";
}


/* LOGIN */
function login() {
    let loginUsername = document.getElementById("login-username").value.toUpperCase()
    let loginPassword = document.getElementById("login-password").value
    let loginMessage = document.getElementById("login-message")
    const userDataString = localStorage.getItem(loginUsername);

    if (!userDataString) {
        loginMessage.innerHTML = "(Wrong password/username)"
        return;
    }
    const userData = JSON.parse(userDataString);
    if (userData.password === loginPassword) {
        sessionStorage.setItem("username", loginUsername);
        window.location.href = "game.html";
    } else {
        loginMessage.innerHTML = "(Wrong password/username)";
    }
}