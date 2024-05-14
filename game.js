import { elements } from './elements.js';
import { winCon, colors } from './constants.js';
import { updateStats } from './statistics.js';

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let difficulty = "easy"; // Set default difficulty to easy
let gameMode = "AI"; // Tracks whether the game is in AI mode or Player mode
let player1Name = "Player 1"; // Default Player 1 name
let player2Name = "Player 2"; // Default Player 2 name

export function startGame() {
    elements.playBtn.classList.add("slide-up");
    setTimeout(() => {
        elements.startScreen.style.display = "none";
        elements.choiceOverlay.style.display = "block";
    }, 300);
}

export function selectGameMode(mode) {
    gameMode = mode;
    elements.choiceOverlay.style.display = "none";
    elements.nameOverlay.style.display = "block";

    if (gameMode === "Player") {
        document.getElementById("name-overlay-content").querySelector("h2").textContent = "Enter Player Names";
        elements.player2NameInput.style.display = "block";
    } else {
        document.getElementById("name-overlay-content").querySelector("h2").textContent = "Enter Your Name";
        elements.player2NameInput.style.display = "none";
    }
}

export function selectDifficulty(level) {
    difficulty = level;
    updateDifficultyText();
    elements.choiceOverlay.style.display = "none";
    elements.gameContainer.style.display = "block";
    initializeGame();
}

export function startGameWithNames() {
    player1Name = elements.player1NameInput.value || "Player 1";
    if (gameMode === "Player") {
        player2Name = elements.player2NameInput.value || "Player 2";
    }
    elements.nameOverlay.style.display = "none";
    elements.gameContainer.style.display = "block";
    initializeGame();
}

export function updateDifficultyText() {
    elements.currentDifficultyText.textContent = `Current Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
}

export function initializeGame() {
    elements.cells.forEach(cell => cell.addEventListener("click", cellClicked));
    updateTurnText();
    running = true;
}

export function cellClicked() {
    const cellInput = this.getAttribute("cellInput");

    if (options[cellInput] !== "" || !running) return;
    
    updateCell(this, cellInput);
    checkWinner();
    if (running && gameMode === "AI" && currentPlayer === 'O') {
        setTimeout(makeAIMove, 150);
    }
}

export function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.innerHTML = `<span style="color: ${colors[currentPlayer]}">${currentPlayer}</span>`;
}

export function checkWinner() {
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

export function declareWinner(winner) {
    let message;
    if (winner === "draw") {
        message = "Draw!";
        updateStats("draw");
    } else if (winner === "X") {
        message = `${gameMode === "AI" ? player1Name : player1Name} wins!`;
        updateStats("win");
    } else {
        message = `${gameMode === "AI" ? "AI" : player2Name} wins!`;
        updateStats("loss");
    }
    showOverlay(message);
    running = false;
}

export function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnText();
}

export function updateTurnText() {
    const name = currentPlayer === "X" ? player1Name : (gameMode === "AI" ? "AI" : player2Name);
    elements.winnerText.innerHTML = `<span style="color: var(--turn-text-color)">${name}'s turn</span>`;
}

export function restartGame() {
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    updateTurnText();
    elements.cells.forEach(cell => cell.textContent = "");
    running = true;
}

export function goBackToStartScreen() {
    elements.startScreen.style.display = "block";
    elements.gameContainer.style.display = "none";
    elements.choiceOverlay.style.display = "none";
    elements.nameOverlay.style.display = "none";
    elements.playBtn.classList.remove("slide-up");  // Reset play button animation
    elements.playBtn.style.display = "block";  // Ensure the play button is visible
    restartGame();
}

export function showOverlay(message) {
    elements.resultsOverlay.style.display = "block";
    elements.resultsOverlayContent.textContent = message;
}

export function hideOverlay() {
    elements.resultsOverlay.style.display = "none";
}

export function hideOverlayAndRestart() {
    hideOverlay();
    restartGame(); // Only restart the game, don't go back to start screen
}

export function makeAIMove() {
    const availableMoves = options.map((opt, index) => opt === "" ? index : null).filter(index => index !== null);
    
    const move = difficulty === "easy" ? randomMove(availableMoves) : (difficulty === "medium" && Math.random() > 0.5) ? randomMove(availableMoves) : bestMove();
    
    options[move] = 'O';
    updateCell(elements.cells[move], move);
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
