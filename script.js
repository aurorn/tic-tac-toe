const cells = document.querySelectorAll(".cell");
const winnerText = document.querySelector(".winner");
const restartBtn = document.querySelector(".restartBtn");
const playBtn = document.getElementById("play-btn");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const overlayScreen = document.getElementById("overlay-screen");
const overlayContent = document.getElementById("overlay-content");

const winCon = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const colors = {
    X: 'rgb(134, 253, 150)',
    O: 'rgb(255, 255, 255)'
};

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

playBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
overlayScreen.addEventListener("click", hideOverlayAndRestart);

function startGame() {
    startScreen.style.display = "none";
    gameContainer.style.display = "block";
    initializeGame();
}

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    updateTurnText();
    running = true;
}

function cellClicked() {
    const cellInput = this.getAttribute("cellInput");

    if (options[cellInput] !== "" || !running) {
        return;
    }
    updateCell(this, cellInput);
    checkWinner();
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.innerHTML = `<span style="color: ${colors[currentPlayer]}">${currentPlayer}</span>`;
}

function checkWinner() {
    for (let i = 0; i < winCon.length; i++) {
        const [a, b, c] = winCon[i];
        if (options[a] && options[a] === options[b] && options[a] === options[c]) {
            declareWinner(options[a]);
            return;
        }
    }
    if (!options.includes("")) {
        declareWinner("draw");
    } else {
        changePlayer();
    }
}

function declareWinner(winner) {
    if (winner === "draw") {
        showOverlay("Draw!");
    } else {
        showOverlay(`${winner} wins!`);
    }
    running = false;
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    updateTurnText();
}

function updateTurnText() {
    winnerText.innerHTML = `<span style="color: ${colors[currentPlayer]}">${currentPlayer}</span>'s turn`;
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    updateTurnText();
    cells.forEach(cell => cell.textContent = "");
    running = true;
}

function showOverlay(message) {
    overlayScreen.style.display = "block";
    overlayContent.textContent = message;
}

function hideOverlay() {
    overlayScreen.style.display = "none";
}

function hideOverlayAndRestart() {
    hideOverlay();
    restartGame();
}
