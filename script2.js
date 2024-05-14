// Constants and Variables
const cells = document.querySelectorAll(".cell");
const winnerText = document.querySelector(".winner");
const restartBtn = document.querySelector(".restartBtn");
const playBtn = document.getElementById("play-btn");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const choiceOverlay = document.getElementById("choice-overlay");
const nameOverlay = document.getElementById("name-overlay");
const resultsOverlayContent = document.getElementById("result-overlay-content");
const aiBtn = document.getElementById("ai-btn");
const playerBtn = document.getElementById("player-btn");
const resultsOverlay = document.getElementById("result-overlay");
const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");
const currentDifficultyText = document.getElementById("current-difficulty");
const goBackBtn = document.querySelector(".goBackBtn");
const player1NameInput = document.getElementById("player1-name-input");
const player2NameInput = document.getElementById("player2-name-input");
const startGameBtn = document.getElementById("start-game-btn");
const themeSwitchBtn = document.getElementById("theme-switch");

const winCon = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const colors = {
    X: 'rgb(36, 36, 36)',
    O: 'rgb(255, 255, 255)'
};

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let difficulty = "easy"; // Set default difficulty to easy
let gameMode = "AI"; // Tracks whether the game is in AI mode or Player mode
let player1Name = "Player 1"; // Default Player 1 name
let player2Name = "Player 2"; // Default Player 2 name

// Event Listeners
playBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
resultsOverlay.addEventListener("click", hideOverlayAndRestart);
goBackBtn.addEventListener("click", goBackToStartScreen);
aiBtn.addEventListener("click", () => selectGameMode("AI"));
playerBtn.addEventListener("click", () => selectGameMode("Player"));
easyBtn.addEventListener("click", () => selectDifficulty("easy"));
mediumBtn.addEventListener("click", () => selectDifficulty("medium"));
hardBtn.addEventListener("click", () => selectDifficulty("hard"));
startGameBtn.addEventListener("click", startGameWithNames);
themeSwitchBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    updateTurnText(); 
});

// Initialize the default difficulty text
updateDifficultyText();

// Function Definitions
function startGame() {
    playBtn.classList.add("slide-up");
    setTimeout(() => {
        startScreen.style.display = "none";
        choiceOverlay.style.display = "block";
    }, 300);
}

function selectGameMode(mode) {
    gameMode = mode;
    choiceOverlay.style.display = "none";
    nameOverlay.style.display = "block";

    // Show Player 2 name input if game mode is Player
    if (gameMode === "Player") {
        document.getElementById("name-overlay-content").querySelector("h2").textContent = "Enter Player Names";
        player2NameInput.style.display = "block";
    } else {
        document.getElementById("name-overlay-content").querySelector("h2").textContent = "Enter Your Name";
        player2NameInput.style.display = "none";
    }
}

function selectDifficulty(level) {
    difficulty = level;
    updateDifficultyText();
    choiceOverlay.style.display = "none";
    gameContainer.style.display = "block";
    initializeGame();
}

function startGameWithNames() {
    player1Name = player1NameInput.value || "Player 1";
    if (gameMode === "Player") {
        player2Name = player2NameInput.value || "Player 2";
    }
    nameOverlay.style.display = "none";
    gameContainer.style.display = "block";
    initializeGame();
}

function updateDifficultyText() {
    currentDifficultyText.textContent = `Current Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
}

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    updateTurnText();
    running = true;
}

function cellClicked() {
    const cellInput = this.getAttribute("cellInput");

    if (options[cellInput] !== "" || !running) return;
    
    updateCell(this, cellInput);
    checkWinner();
    if (running && gameMode === "AI" && currentPlayer === 'O') {
        setTimeout(makeAIMove, 150);
    }
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
    let message;
    if (winner === "draw") {
        message = "Draw!";
    } else if (winner === "X") {
        message = `${gameMode === "AI" ? player1Name : player1Name} wins!`;
    } else {
        message = `${gameMode === "AI" ? "AI" : player2Name} wins!`;
    }
    showOverlay(message);
    running = false;
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnText();
}

function updateTurnText() {
    const name = currentPlayer === "X" ? player1Name : (gameMode === "AI" ? "AI" : player2Name);
    winnerText.innerHTML = `<span style="color: var(--turn-text-color)">${name}'s turn</span>`;
}

function restartGame() {
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    updateTurnText();
    cells.forEach(cell => cell.textContent = "");
    running = true;
}

function goBackToStartScreen() {
    startScreen.style.display = "block";
    gameContainer.style.display = "none";
    choiceOverlay.style.display = "none";
    nameOverlay.style.display = "none";
    playBtn.classList.remove("slide-up");  // Reset play button animation
    playBtn.style.display = "block";  // Ensure the play button is visible
    restartGame();
}

function showOverlay(message) {
    resultsOverlay.style.display = "block";
    resultsOverlayContent.textContent = message;
}

function hideOverlay() {
    resultsOverlay.style.display = "none";
}

function hideOverlayAndRestart() {
    hideOverlay();
    restartGame(); // Only restart the game, don't go back to start screen
}

function makeAIMove() {
    const availableMoves = options.map((opt, index) => opt === "" ? index : null).filter(index => index !== null);
    
    const move = difficulty === "easy" ? randomMove(availableMoves) : (difficulty === "medium" && Math.random() > 0.5) ? randomMove(availableMoves) : bestMove();
    
    options[move] = 'O';
    updateCell(cells[move], move);
    checkWinner();
}

function randomMove(availableMoves) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < options.length; i++) {
        if (options[i] === '') {
            options[i] = 'O';
            const score = minimax(options, 0, false);
            options[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const result = checkResult(board);
    if (result !== null) return result === 'O' ? 1 : result === 'X' ? -1 : 0;

    const scores = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = isMaximizing ? 'O' : 'X';
            const score = minimax(board, depth + 1, !isMaximizing);
            board[i] = '';
            scores.push(score);
        }
    }
    return isMaximizing ? Math.max(...scores) : Math.min(...scores);
}

function checkResult(board) {
    for (let i = 0; i < winCon.length; i++) {
        const [a, b, c] = winCon[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.includes('') ? null : 'draw';
}

// Initialize the default difficulty text
updateDifficultyText();
