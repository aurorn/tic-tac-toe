export const statistics = {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
};

export function updateStats(result) {
    statistics.gamesPlayed++;
    if (result === "win") {
        statistics.wins++;
    } else if (result === "loss") {
        statistics.losses++;
    } else if (result === "draw") {
        statistics.draws++;
    }

    displayStats();
}

export function displayStats() {
    const statsElement = document.getElementById("stats");
    statsElement.innerHTML = `
        Games Played: ${statistics.gamesPlayed}<br>
        Wins: ${statistics.wins}<br>
        Losses: ${statistics.losses}<br>
        Draws: ${statistics.draws}
    `;
}

export function resetStats() {
    statistics.gamesPlayed = 0;
    statistics.wins = 0;
    statistics.losses = 0;
    statistics.draws = 0;
    displayStats();
}
