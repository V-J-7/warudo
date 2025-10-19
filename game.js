document.getElementsByClassName("profile")[0].addEventListener("click", () => {
    window.location.href = "user.html";
    
});

// Get username from session storage and display it on the page.
document.getElementById("username").innerHTML = "(" + sessionStorage.getItem("username");

// Set the total number of attempts allowed for the game.
let attempts = 6;

// Function to dynamically create the game grid based on the word length.
function createBoxes(wordLen) {
    let container = document.getElementsByClassName("container")[0];
    for (let i = 0; i < attempts; i++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < wordLen; j++) {
            let box = document.createElement("div");
            box.className = "box";
            box.innerHTML = `<input type="text" maxlength="1" class="char-input">`
            row.appendChild(box)
        }
        container.appendChild(row)
    }
    let button = document.createElement("button");
    button.type = "submit"
    button.className = "restart-button"
    button.innerHTML = "Restart"
    button.onclick = () => location.reload();
    container.appendChild(button);
}
// Initialize the word
let word = "";
let difficulty = "";

// Keep track of the current row the user is typing in.
var rowIndex = 0;

// This function is triggered when a user selects a difficulty level.
function difficultyChooser(n) {
    const difficulties = ["Pushover", "Tryhard", "Nightmare"];
    difficulty = difficulties[n];
    let difficultySelector = document.getElementsByClassName("difficulty-selector")[0];
    let indicatorContainer = document.getElementsByClassName("indicators-container")[0];
    indicatorContainer.style.display = "flex";
    // Select a random word from the chosen difficulty's word list.
    word = wordList[n][Math.floor(Math.random() * wordList[n].length)].toUpperCase()
    // Hide the difficulty selection menu.
    difficultySelector.style.display = "none";
    // Create the game grid and set up input listeners.
    createBoxes(word.length);
    createKeyboard();
    handleInput(word.length);
    console.log(word);
}

function createKeyboard() {
    const keyboardContainer = document.querySelector(".keyboard");
    const keysLayout = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM"
    ];

    keysLayout.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "k-row";
        for (const char of row) {
            const keyDiv = document.createElement("div");
            keyDiv.className = "key";
            keyDiv.textContent = char;
            keyDiv.id = `key-${char}`; // ID for easy access
            rowDiv.appendChild(keyDiv);
        }
        keyboardContainer.appendChild(rowDiv);
    });
}
// Initialize the player's score. It decreases with each incorrect attempt.
var points = 6;

// This function sets up all the event listeners for the input boxes.
function handleInput(wordLen) {
    let rows = [...document.getElementsByClassName("row")];
    let wordMessage = document.getElementById("word-message");
    rows.forEach((row, rIndex) => {
        let inputs = [...row.querySelectorAll("input")]
        inputs.forEach((input, index) => {
            input.addEventListener("input", () => {
                // Sanitize input to only allow alphabetic characters and convert to uppercase.
                input.value = input.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
                // Automatically focus the next input box in the row after a character is entered.
                if (input.value && index < wordLen - 1) {
                    inputs[index + 1].focus();
                }
            });
            
            // Add listeners for keyboard navigation and submission.
            input.addEventListener("keydown", (event) => {
                // Handle navigation between input boxes with Backspace, Delete, and Arrow keys.
                if (event.key === "Backspace" && !input.value && index > 0) {
                    inputs[index - 1].focus();
                } else if (event.key === "Delete" && !input.value && index < wordLen - 1) {
                    inputs[index + 1].focus();
                } else if (event.key === "ArrowLeft" && index > 0) {
                    inputs[index - 1].focus();
                } else if (event.key === "ArrowRight" && index < wordLen - 1) {
                    inputs[index + 1].focus();
                }
                
                // Handle the 'Enter' key press to submit a guess.
                if (event.key === "Enter" && index === wordLen - 1 && rowIndex === rIndex) {
                    // Check if all boxes in the row are filled.
                    if ([...inputs].some(inp => inp.value === "")) {
                        return; 
                    }
                    // Combine the letters to form the entered word.
                    let enteredWord = [...inputs].map(inp => inp.value).join("").toUpperCase();
                    // Check if the entered word is in the valid word list.
                    if (!wordList.flat().includes(enteredWord)) {
                        wordMessage.innerHTML = "(word not in list)"
                        return;
                    }
                    wordMessage.innerHTML = ""
                    // Validate the guess against the secret word.
                    validateInput(rowIndex, enteredWord, word);
                    // Check for a win condition.
                    if (enteredWord === word) {
                        createPopup(points);
                        rowIndex = attempts; // Stop further input by setting rowIndex out of bounds.
                    } else {
                        points--;
                        rowIndex++;
                        // Check for a loss condition (out of points/attempts).
                        if (points === 0 && rowIndex === attempts) {
                            createPopup(points);
                        }
                    }
                }
            });
        });
    });
}

// Function to create and display the end-of-game popup.
function createPopup(points) {
    let popup = document.getElementById("popup")
    let popupMessage = document.getElementById("popup-message")
    popup.style.display = "flex";
    popupMessage.style.alignItems = "center";
    popupMessage.style.justifyContent = "center";
    // Display a "You Won" message if the player has points remaining.
    if (points !== 0) {
        popupMessage.innerHTML = `<h1>(You Won!)</h1><br>`
        popupMessage.innerHTML += `<h1>(You scored <span>${points}</span> out of <span>${attempts}</span>) </h1>`
    }
    else {
        // Display a "You Lost" message and reveal the correct word. 
        popupMessage.innerHTML = `<h1>(You Lost!)</h1>`
        popupMessage.innerHTML += `<h1>(You scored ${points} out of 6 points) </h1>`
        popupMessage.innerHTML += `<h2>(The correct word was <span>${word}</span>)</h2>`
    }
    updateUserScore(points, word, difficulty);
    popup.addEventListener("click", () => {
        popup.style.display = "none";
        location.reload();
    })

    
}

// Function to update the user's score in localStorage
function updateUserScore(newScore, gameWord, gameDifficulty) {
    const currentUser = sessionStorage.getItem("username");
    if (!currentUser) return;

    const userDataString = localStorage.getItem(currentUser);
    if (!userDataString) return;

    let userData;
    try {
        // Try to parse the data as a JSON object (new format)
        userData = JSON.parse(userDataString);
    } catch (e) {
        // If parsing fails, assume it's the old format (just a password string)
        // and create a new User object to upgrade the data structure.
        console.log("Upgrading user data structure for:", currentUser);
        userData = {
            password: userDataString, // The old string was the password
            scores: [],
            averageScore: 0
        };
    }

    const newGame = {
        word: gameWord,
        difficulty: gameDifficulty,
        score: newScore
    };

    userData.scores.unshift(newGame); // Add to the beginning of the array
    const totalScore = userData.scores.reduce((sum, game) => sum + game.score, 0);
    userData.averageScore = userData.scores.length > 0 ? (totalScore / userData.scores.length).toFixed(2) : 0;

    localStorage.setItem(currentUser, JSON.stringify(userData));
}

// This function validates the submitted word and provides visual feedback.
function validateInput(rowIndex, enteredWord, word) {
    const row = document.getElementsByClassName("row")[rowIndex];
    const boxes = row.getElementsByClassName("box");
    const inputs = row.querySelectorAll("input");

    // Make a mutable copy of the word letters
    const tempWord = word.split('');

    // First pass: check for correct letters in correct positions (cyan).
    for (let i = 0; i < enteredWord.length; i++) {
        const char = enteredWord[i];
        const key = document.getElementById(`key-${char}`);

        if (enteredWord[i] === word[i]) {
            boxes[i].style.backgroundColor = "#00FFFF"; // correct position
            if (key) key.style.backgroundColor = "#00FFFF";
            tempWord[i] = null; // mark this letter as used
        }
    }

    // Second pass: check for correct letters in wrong positions (magenta) and incorrect letters.
    for (let i = 0; i < enteredWord.length; i++) {
        const char = enteredWord[i];
        const key = document.getElementById(`key-${char}`);

        if (boxes[i].style.backgroundColor !== "rgb(0, 255, 255)") { // not already cyan
            const idx = tempWord.indexOf(enteredWord[i]);
            if (idx !== -1) {
                boxes[i].style.backgroundColor = "#FF00FF"; // wrong position
                // Only update keyboard if it's not already correct (cyan)
                if (key && key.style.backgroundColor !== "rgb(0, 255, 255)") {
                    key.style.backgroundColor = "#FF00FF";
                }
                tempWord[idx] = null; // mark as used to prevent matching the same letter twice
            } else {
                boxes[i].style.backgroundColor = "#333"; // letter not in word
                if (key) key.style.backgroundColor = "#333";
            }
        }
    }

    // Make the row readonly
    inputs.forEach(inp => inp.setAttribute("readonly", true));

    // Focus next row if it exists
    const nextRow = document.getElementsByClassName("row")[rowIndex + 1];
    if (nextRow) {
        const firstInput = nextRow.querySelector("input");
        if (firstInput) firstInput.focus();
    }
}


// Initial call to set up input handling for the default word.
handleInput(word.length);