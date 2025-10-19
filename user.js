// Get the current user from session storage
const currentUser = sessionStorage.getItem("username");

// If no user is logged in, redirect to the login page
if (!currentUser) {
    window.location.href = "index.html";
} else {
    // Display the username on the page
    document.getElementById("username-display").textContent = `(${currentUser})`;    
    const userDataString = localStorage.getItem(currentUser);
    let userData;

    try {
        userData = JSON.parse(userDataString);
    } catch (e) {
        // Handle old data format if it exists, though it's less likely to be an issue here
        // as the user page is mostly for users created with the new system.
        // We'll create a default structure to prevent crashes.
        userData = { password: userDataString, scores: [], averageScore: 0 };
    }

    if (userData) {
        document.getElementById("average-score").textContent = userData.averageScore || 'N/A';
        const statsTableBody = document.getElementById("stats-table-body");

        if (userData.scores && Array.isArray(userData.scores) && userData.scores.length > 0) {
            // Display the last 5 games
            const recentGames = userData.scores.slice(0, 5);
            recentGames.forEach(game => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${game.word || 'N/A'}</td><td>${game.difficulty || 'N/A'}</td><td>${game.score}</td>`;
                statsTableBody.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 3;
            cell.textContent = 'No games played yet.';
            row.appendChild(cell);
            statsTableBody.appendChild(row);
        }
    }
}

function updatePassword() {
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const updateMessage = document.getElementById("update-message");

    if (!currentPassword || !newPassword) {
        updateMessage.textContent = "(Please fill out all fields)";
        return;
    }

    const userDataString = localStorage.getItem(currentUser);
    const userData = JSON.parse(userDataString);

    if (userData && userData.password === currentPassword) {
        userData.password = newPassword;
        localStorage.setItem(currentUser, JSON.stringify(userData));
        updateMessage.textContent = "(Password updated successfully!)";
        document.getElementById("current-password").value = "";
        document.getElementById("new-password").value = "";
    } else {
        updateMessage.textContent = "(Incorrect current password)";
    }
}

function deleteAccount() {
    const confirmPassword = document.getElementById("delete-confirm-password").value;
    const userDataString = localStorage.getItem(currentUser);
    const userData = JSON.parse(userDataString);


    if (userData && userData.password === confirmPassword) {
        if (window.confirm("Are you sure you want to permanently delete your account?")) {
            localStorage.removeItem(currentUser);
            sessionStorage.removeItem("username");
            alert("Account deleted successfully.");
            window.location.href = "index.html";
        }
    } else {
        alert("Incorrect password. Account deletion failed.");
    }
}