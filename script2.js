// Constants and Variables
const cells = document.querySelectorAll(".cell");
const winnerText = document.querySelector(".winner");
const restartBtn = document.querySelector(".restartBtn");
const playBtn = document.getElementById("play-btn");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const choiceOverlay = document.getElementById("choice-overlay");
const resultsOverlayContent = document.getElementById("result-overlay-content");
const aiBtn = document.getElementById("ai-btn");
const playerBtn = document.getElementById("player-btn");
const resultsOverlay = document.getElementById("result-overlay");
const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");
const currentDifficultyText = document.getElementById("current-difficulty");
const goBackBtn = document.querySelector(".goBackBtn");

const winCon = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

const colors = {
    X: 'rgb(36, 36, 36)',
    O: 'rgb(255, 255, 255)'
};

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let difficulty = "easy"; 
let gameMode = "AI"; e

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
    gameContainer.style.display = "block";
    initializeGame();
}

function selectDifficulty(level) {
    difficulty = level;
    updateDifficultyText();
    choiceOverlay.style.display = "none";
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
    showOverlay(winner === "draw" ? "Draw!" : `${winner} wins!`);
    running = false;
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnText();
}

function updateTurnText() {
    winnerText.innerHTML = `<span style="color: ${colors[currentPlayer]}">${currentPlayer}</span>'s turn`;
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
    playBtn.classList.remove("slide-up"); 
    playBtn.style.display = "block";  
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
    restartGame(); 
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

updateDifficultyText();
