/* SIGN UP */
function signup() {
    let signupUsername = document.getElementById("signup-username").value.toUpperCase()
    let signupPassword = document.getElementById("signup-password").value
    let signupMessage = document.getElementById("signup-message")
    if (localStorage.getItem(signupUsername) != null) {
        signupMessage.textContent = "(User is Already Registered)"
    }
    else {
        localStorage.setItem(signupUsername, signupPassword)
        signupMessage.innerHTML = "(User Registered Successfully)"
    }
}


/* LOGIN */
function login() {
    let loginUsername = document.getElementById("login-username").value.toUpperCase()
    let loginPassword = document.getElementById("login-password").value
    let loginMessage = document.getElementById("login-message")
    if (localStorage.getItem(loginUsername) != loginPassword) {
        loginMessage.innerHTML = "(Wrong password)"
    }
    else {
        window.location.href = "game.html"
    }
}