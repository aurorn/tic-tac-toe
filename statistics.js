export const statistics = {
    playerVsAI: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
    },
    playerVsPlayer: {
        gamesPlayed: 0,
        player1Wins: 0,
        player2Wins: 0,
        draws: 0,
    }
};

export function updateStats(result, mode) {
    if (mode === "AI") {
        statistics.playerVsAI.gamesPlayed++;
        if (result === "win") {
            statistics.playerVsAI.wins++;
        } else if (result === "loss") {
            statistics.playerVsAI.losses++;
        } else if (result === "draw") {
            statistics.playerVsAI.draws++;
        }
    } else if (mode === "Player") {
        statistics.playerVsPlayer.gamesPlayed++;
        if (result === "player1Win") {
            statistics.playerVsPlayer.player1Wins++;
        } else if (result === "player2Win") {
            statistics.playerVsPlayer.player2Wins++;
        } else if (result === "draw") {
            statistics.playerVsPlayer.draws++;
        }
    }
    displayStats(mode);
    saveStats();
}

export function displayStats(mode) {
    const statsElement = document.getElementById("stats");
    let statsHTML = "";

    if (mode === "AI") {
        statsHTML = `
            <span style="color: var(--stats-text-color);">
                <h2>Player vs AI</h2>
                Games Played: ${statistics.playerVsAI.gamesPlayed}<br>
                Wins: ${statistics.playerVsAI.wins}<br>
                Losses: ${statistics.playerVsAI.losses}<br>
                Draws: ${statistics.playerVsAI.draws}<br><br>
            </span>
        `;
    } else if (mode === "Player") {
        statsHTML = `
            <span style="color: var(--stats-text-color);">
                <h2>Player vs Player</h2>
                Games Played: ${statistics.playerVsPlayer.gamesPlayed}<br>
                Player 1 Wins: ${statistics.playerVsPlayer.player1Wins}<br>
                Player 2 Wins: ${statistics.playerVsPlayer.player2Wins}<br>
                Draws: ${statistics.playerVsPlayer.draws}
            </span>
        `;
    }

    statsElement.innerHTML = statsHTML;
    statsElement.style.display = "block";
}

export function saveStats() {
    localStorage.setItem('ticTacToeStats', JSON.stringify(statistics));
}

export function loadStats() {
    const savedStats = localStorage.getItem('ticTacToeStats');
    if (savedStats) {
        Object.assign(statistics, JSON.parse(savedStats));
    }
}
