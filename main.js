import { elements } from './elements.js';
import { startGame, selectGameMode, selectDifficulty, startGameWithNames, goBackToStartScreen, hideOverlayAndRestart, restartGame } from './game.js';
import { toggleTheme } from './theme.js';
import { displayStats, resetStats } from './statistics.js';

// Event Listeners
elements.playBtn.addEventListener("click", startGame);
elements.restartBtn.addEventListener("click", restartGame);
elements.resultsOverlay.addEventListener("click", hideOverlayAndRestart);
elements.goBackBtn.addEventListener("click", goBackToStartScreen);
elements.aiBtn.addEventListener("click", () => selectGameMode("AI"));
elements.playerBtn.addEventListener("click", () => selectGameMode("Player"));
elements.easyBtn.addEventListener("click", () => selectDifficulty("easy"));
elements.mediumBtn.addEventListener("click", () => selectDifficulty("medium"));
elements.hardBtn.addEventListener("click", () => selectDifficulty("hard"));
elements.startGameBtn.addEventListener("click", startGameWithNames);
elements.themeSwitchBtn.addEventListener("click", () => {
    toggleTheme();
    updateTurnText(); 
});


displayStats();
