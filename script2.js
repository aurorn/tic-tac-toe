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
let difficulty = "hard";

playBtn.addEventListener("click", () => {
    playBtn.classList.add("slide-up");
    setTimeout(() => {
        startScreen.style.display = "none";
        choiceOverlay.style.display = "block";
    }, 300);
});

restartBtn.addEventListener("click", resetToStartScreen);
resultsOverlay.addEventListener("click", hideOverlayAndRestart);

aiBtn.addEventListener("click", () => {
    choiceOverlay.style.display = "none";
    gameContainer.style.display = "block";
    initializeGame();
});

playerBtn.addEventListener("click", () => {
    choiceOverlay.style.display = "none";
    gameContainer.style.display = "block";
    initializeGame();
});

easyBtn.addEventListener("click", () => {
    difficulty = "easy";
    updateDifficultyText();
    choiceOverlay.style.display = "none";
    gameContainer.style.display = "block";
    initializeGame();
});

mediumBtn.addEventListener("click", () => {
    difficulty = "medium";
    updateDifficultyText();
    choiceOverlay.style.display = "none";
    gameContainer.style.display = "block";
    initializeGame();
});

hardBtn.addEventListener("click", () => {
    difficulty = "hard";
    updateDifficultyText();
    choiceOverlay.style.display = "none";
    gameContainer.style.display = "block";
    initializeGame();
});

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

    if (options[cellInput] !== "" || !running) {
        return;
    }
    updateCell(this, cellInput);
    checkWinner();
    if (running && currentPlayer === 'O') {
        setTimeout(() => {
            makeAIMove();
        }, 150);
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

function resetToStartScreen() {
    startScreen.style.display = "block";
    gameContainer.style.display = "none";
    choiceOverlay.style.display = "none";
    playBtn.classList.remove("slide-up");  // Reset play button animation
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
    resetToStartScreen();
}

function makeAIMove() {
    if (difficulty === "easy") {
        makeRandomMove();
    } else if (difficulty === "medium") {
        if (Math.random() > 0.5) {
            makeRandomMove();
        } else {
            bestMove();
        }
    } else {
        bestMove();
    }
}

function makeRandomMove() {
    let availableMoves = [];
    options.forEach((option, index) => {
        if (option === "") {
            availableMoves.push(index);
        }
    });

    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    options[move] = 'O';
    updateCell(cells[move], move);
    checkWinner();
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < options.length; i++) {
        if (options[i] === '') {
            options[i] = 'O';
            let score = minimax(options, 0, false);
            options[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    options[move] = 'O';
    updateCell(cells[move], move);
    checkWinner();
}

function minimax(board, depth, isMaximizing) {
    let result = checkResult(board);
    if (result !== null) {
        return result === 'O' ? 1 : result === 'X' ? -1 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkResult(board) {
    for (let i = 0; i < winCon.length; i++) {
        const [a, b, c] = winCon[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes('') ? null : 'draw';
}
