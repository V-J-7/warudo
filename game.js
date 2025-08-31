document.getElementById("username").innerHTML = "(" + sessionStorage.getItem("username");

const wordList = [
  // pushover
  ["apple", "chair", "water", "plant", "table", "bread", "light", "stone", "house", "world",
   "sweet", "candy", "music", "smile", "beach", "cloud", "dream", "happy", "round", "green"],

  // tryhard
  ["crisp", "flock", "jumpy", "knack", "quirk", "spite", "vivid", "waltz", "zebra", "blunt",
   "brisk", "charm", "gleam", "hound", "latch", "prism", "spear", "troop", "whisk", "yield"],

  // nightmare
  ["xylem", "fjord", "glyph", "nymph", "psalm", "quoth", "rhino", "slyly", "tzars", "wyver",
   "crwth", "syzyg", "khaki", "jiffy", "prawn", "vexed", "wryly", "oxbow", "zephy", "qanat"]
];


for (let i = 0; i < wordList.length; i++) {
    wordList[i] = wordList[i].map((value) => value.toUpperCase())
}

let attempts = 6;

function createBoxes(wordLen) {
    let container = document.getElementsByClassName("container")[0]
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
}

var difficulties = 3;
let word = wordList[0][Math.floor(Math.random() * wordList[0].length)].toUpperCase();

var rowIndex = 0;

function difficultyChooser(n) {
    let difficultySelector = document.getElementsByClassName("difficulty-selector")[0];
    word = wordList[n][Math.floor(Math.random() * wordList[n].length)].toUpperCase()
    difficultySelector.style.display = "none";
    createBoxes(word.length);
    handleInput(word.length);
}
var points = 6;

function handleInput(wordLen) {
    let rows = [...document.getElementsByClassName("row")];
    let wordMessage = document.getElementById("word-message");
    rows.forEach((row, rIndex) => {
        let inputs = [...row.querySelectorAll("input")]
        inputs.forEach((input, index) => {
            input.addEventListener("input", () => {
                input.value = input.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
                if (input.value && index < wordLen - 1) {
                    inputs[index + 1].focus();
                }
            });
            
            input.addEventListener("keydown", (event) => {
                if (event.key === "Backspace" && !input.value && index > 0) {
                    inputs[index - 1].focus();
                } else if (event.key === "Delete" && !input.value && index < wordLen - 1) {
                    inputs[index + 1].focus();
                } else if (event.key === "ArrowLeft" && index > 0) {
                    inputs[index - 1].focus();
                } else if (event.key === "ArrowRight" && index < wordLen - 1) {
                    inputs[index + 1].focus();
                }
                
                if (event.key === "Enter" && index === wordLen - 1 && rowIndex === rIndex) {
                    if ([...inputs].some(inp => inp.value === "")) {
                        return; 
                    }
                    let enteredWord = [...inputs].map(inp => inp.value).join("").toUpperCase();
                    if (!wordList.flat().includes(enteredWord)) {
                        wordMessage.innerHTML = "(word not in list)"
                        return;
                    }
                    wordMessage.innerHTML = ""
                    validateInput(rowIndex, enteredWord, word);
                    rowIndex++;
                    if (enteredWord === word) {
                        createPopup(points);
                        rowIndex = 5;                        
                    }
                    points--;
                    if (points === 0) {
                        createPopup(points);
                        rowIndex = 5;
                    }
                }
            });
        });
    });
}

function createPopup(points) {
    let popup = document.getElementById("popup")
    let popupMessage = document.getElementById("popup-message")
    popup.style.display = "flex";
    popupMessage.style.alignItems = "center";
    popupMessage.style.justifyContent = "center";
    if (points !== 0) {
        popupMessage.innerHTML = `<h1>(You Won!)</h1><br>`
        popupMessage.innerHTML += `<h1>(You scored <span>${points}</span> out of <span>${attempts}</span>) </h1>`
    }
    else {
        popupMessage.innerHTML = `<h1>(You Lost!)</h1>`
        popupMessage.innerHTML += `<h1>(You scored ${points} out of 6 points) </h1>`
    }
    popup.addEventListener("click", () => {
        popup.style.display = "none";
        location.reload();
    })
}


function validateInput(rowIndex, enteredWord, word) {
    let row = document.getElementsByClassName("row")[rowIndex];
    let boxes = row.getElementsByClassName("box");
    let inputs = row.querySelectorAll("input");
    if (wordList.flat().includes(enteredWord)) {
        for (let i = 0; i < enteredWord.length; i++) {
            if (word[i] === enteredWord[i]) {
                boxes[i].style.backgroundColor = "#00FFFF"; 
            } 
            else if (word.includes(enteredWord[i])) {
                boxes[i].style.backgroundColor = "#FF00FF"; 
            }
            else {
                boxes[i].style.backgroundColor = "#333";
            }
        }
        inputs.forEach(inp => inp.setAttribute("readonly", true));
    }
    let nextRow = document.getElementsByClassName("row")[rowIndex + 1];
    if (nextRow) {
        let firstInput = nextRow.querySelector("input");
        if (firstInput) firstInput.focus();
    }
}


handleInput(word.length);