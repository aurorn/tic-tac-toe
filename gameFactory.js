import { elements } from './elements.js';
import { winCon, colors } from './constants.js';
import { updateStats, displayStats } from './statistics.js';

export function Game() {
    let options = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let running = false;
    let difficulty = "easy"; // Set default difficulty to easy
    let gameMode = "AI"; // Tracks whether the game is in AI mode or Player mode
    let player1Name = "Player 1"; // Default Player 1 name
    let player2Name = "AI"; // Default Player 2 name, changed based on game mode

    const startGame = () => {
        elements.playBtn.classList.add("slide-up");
        setTimeout(() => {
            elements.startScreen.style.display = "none";
            elements.choiceOverlay.style.display = "block";
        }, 300);
    };

    const selectGameMode = (mode) => {
        gameMode = mode;
        player2Name = gameMode === "AI" ? "AI" : "Player 2"; // Set player2Name based on game mode
        elements.choiceOverlay.style.display = "none";
        elements.nameOverlay.style.display = "block";

        if (gameMode === "Player") {
            document.getElementById("name-overlay-content").querySelector("h2").textContent = "Enter Player Names";
            elements.player2NameInput.style.display = "block";
        } else {
            document.getElementById("name-overlay-content").querySelector("h2").textContent = "Enter Your Name";
            elements.player2NameInput.style.display = "none";
        }
    };

    const selectDifficulty = (level) => {
        difficulty = level;
        updateDifficultyText();
        elements.choiceOverlay.style.display = "none";
        elements.gameContainer.style.display = "block";
        initializeGame();
    };

    const startGameWithNames = () => {
        player1Name = elements.player1NameInput.value || "Player 1";
        if (gameMode === "Player") {
            player2Name = elements.player2NameInput.value || "Player 2";
        }
        elements.nameOverlay.style.display = "none";
        elements.gameContainer.style.display = "block";
        initializeGame();
        displayStats(gameMode); // Display stats for the selected game mode
    };

    const updateDifficultyText = () => {
        elements.currentDifficultyText.textContent = `Current Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
    };

    const initializeGame = () => {
        elements.cells.forEach(cell => cell.addEventListener("click", cellClicked));
        updateTurnText();
        running = true;
    };

    const cellClicked = function () {
        const cellInput = this.getAttribute("cellInput");

        if (options[cellInput] !== "" || !running) return;

        updateCell(this, cellInput);
        checkWinner();
        if (running && gameMode === "AI" && currentPlayer === 'O') {
            setTimeout(makeAIMove, 150);
        }
    };

    const updateCell = (cell, index) => {
        options[index] = currentPlayer;
        cell.innerHTML = `<span style="color: ${colors[currentPlayer]}">${currentPlayer}</span>`;
    };

    const checkWinner = () => {
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
    };

    const declareWinner = (winner) => {
        let message;
        if (winner === "draw") {
            message = "Draw!";
            updateStats("draw", gameMode);
        } else {
            if (gameMode === "AI") {
                message = winner === "X" ? `${player1Name} wins!` : `${player2Name} wins!`;
                updateStats(winner === "X" ? "win" : "loss", gameMode);
            } else {
                message = winner === "X" ? `${player1Name} wins!` : `${player2Name} wins!`;
                updateStats(winner === "X" ? "player1Win" : "player2Win", gameMode);
            }

            // Highlight winning cells
            for (let i = 0; i < winCon.length; i++) {
                const [a, b, c] = winCon[i];
                if (options[a] && options[a] === options[b] && options[a] === options[c]) {
                    elements.cells[a].classList.add('winning-cell');
                    elements.cells[b].classList.add('winning-cell');
                    elements.cells[c].classList.add('winning-cell');
                    break;
                }
            }
        }
        showOverlay(message);
        displayStats(gameMode); // Ensure stats are updated and displayed
        running = false;
    };

    const changePlayer = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnText();
    };

    const updateTurnText = () => {
        const name = currentPlayer === "X" ? player1Name : player2Name;
        elements.winnerText.innerHTML = `<span style="color: var(--turn-text-color)">${name}'s turn</span>`;
    };

    const restartGame = () => {
        options = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        updateTurnText();
        elements.cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('winning-cell'); // Remove highlight class
        });
        running = true;
        displayStats(gameMode); // Ensure stats are updated and displayed after restart
    };

    const goBackToStartScreen = () => {
        elements.startScreen.style.display = "block";
        elements.gameContainer.style.display = "none";
        elements.choiceOverlay.style.display = "none";
        elements.nameOverlay.style.display = "none";
        elements.playBtn.classList.remove("slide-up");  // Reset play button animation
        elements.playBtn.style.display = "block";  // Ensure the play button is visible
        elements.statsElement.style.display = "none";  // Hide stats when going back to start screen
        restartGame();
    };

    const showOverlay = (message) => {
        elements.resultsOverlay.style.display = "block";
        elements.resultsOverlayContent.textContent = message;
    };

    const hideOverlay = () => {
        elements.resultsOverlay.style.display = "none";
    };

    const hideOverlayAndRestart = () => {
        hideOverlay();
        restartGame(); // Only restart the game, don't go back to start screen
    };

    const makeAIMove = () => {
        const availableMoves = options.map((opt, index) => opt === "" ? index : null).filter(index => index !== null);

        const move = difficulty === "easy" ? randomMove(availableMoves) : (difficulty === "medium" && Math.random() > 0.5) ? randomMove(availableMoves) : bestMove();

        options[move] = 'O';
        updateCell(elements.cells[move], move);
        checkWinner();
    };

    const randomMove = (availableMoves) => {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    };

    const bestMove = () => {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < options.length; i++) {
            if (options[i] === '') {
                options[i] = 'O';
                const score = minimax(options, 0, false, -Infinity, Infinity);
                options[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    const minimax = (board, depth, isMaximizing, alpha, beta) => {
        const result = checkResult(board);
        if (result !== null) return result === 'O' ? 1 : result === 'X' ? -1 : 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false, alpha, beta);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true, alpha, beta);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            return bestScore;
        }
    };

    const checkResult = (board) => {
        for (let i = 0; i < winCon.length; i++) {
            const [a, b, c] = winCon[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        return board.includes('') ? null : 'draw';
    };

    return {
        startGame,
        selectGameMode,
        selectDifficulty,
        startGameWithNames,
        restartGame,
        goBackToStartScreen,
        hideOverlayAndRestart,
        updateTurnText,
    };
}
