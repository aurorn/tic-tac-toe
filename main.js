import { elements } from './elements.js';
import { Game } from './gameFactory.js';
import { toggleTheme } from './theme.js';
import { displayStats, loadStats } from './statistics.js';

const game = Game();

// Event Listeners
elements.playBtn.addEventListener("click", game.startGame);
elements.restartBtn.addEventListener("click", game.restartGame);
elements.resultsOverlay.addEventListener("click", game.hideOverlayAndRestart);
elements.goBackBtn.addEventListener("click", game.goBackToStartScreen);
elements.aiBtn.addEventListener("click", () => game.selectGameMode("AI"));
elements.playerBtn.addEventListener("click", () => game.selectGameMode("Player"));
elements.easyBtn.addEventListener("click", () => game.selectDifficulty("easy"));
elements.mediumBtn.addEventListener("click", () => game.selectDifficulty("medium"));
elements.hardBtn.addEventListener("click", () => game.selectDifficulty("hard"));
elements.startGameBtn.addEventListener("click", game.startGameWithNames);
elements.themeSwitchBtn.addEventListener("click", () => {
    toggleTheme();
    game.updateTurnText(); // Update turn text color immediately after theme switch
    displayStats(gameMode); // Update stats text color immediately after theme switch
});

// Initialize statistics display
loadStats();
