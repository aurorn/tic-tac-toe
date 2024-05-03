const cells = document.querySelectorAll(".cell");
const winnerText = document.querySelector(".winner");
const restartBtn = document.querySelector(".restartBtn");


const winCon = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

intializeGame();

function intializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    winnerText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellInput = this.getAttribute("cellInput");

    if(options[cellInput] != "" || !running){
        return;
    }
    updateCell(this, cellInput)
    checkWinner();
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    const textColor = (currentPlayer === 'X') ? 'rgb(134, 253, 150)' : 'rgb(255, 255, 255)';
    cell.innerHTML = `<span style="color: ${textColor}">${currentPlayer}</span>`;
}


function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;

}

function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winCon.length; i++){
        const con = winCon[i];
        const cellA = options[con[0]];
        const cellB = options[con[1]];
        const cellC = options[con[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        winnerText.textContent = `${currentPlayer} wins`;
        running = false;
    
    }

    else if(!options.includes("")){
        winnerText.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = "X"
    options = ["", "", "", "", "", "", "", "", ""];
    winnerText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}

document.addEventListener("DOMContentLoaded", function() {
    const playBtn = document.getElementById("play-btn");
    const startScreen = document.getElementById("start-screen");
    const gameContainer = document.getElementById("game-container");

    playBtn.addEventListener("click", function() {
        startScreen.style.display = "none";
        gameContainer.style.display = "block";
        intializeGame();
    });
});