function Game() {
    //create array board, empty items
    const board = Array(9).fill(null)

    // display in html
    const htmlFields = document.getElementsByClassName("field");
    const form1 = document.getElementById("form1");
    const idPlayer1 = document.getElementById("idPlayer1");
    const nametagPlayer1 = document.getElementById("nametag1");
    const form2 = document.getElementById("form2");
    const idPlayer2 = document.getElementById("idPlayer2");
    const nametagPlayer2 = document.getElementById("nametag2");
    const htmlAnnounce = document.getElementById("announce");
    const htmlBoard = document.getElementById("board");
    const startBttn = document.getElementById("start");

    let winner;
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],    // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],    // columns
        [0, 4, 8], [2, 4, 6]                // diagonals
    ]

    function Player(name, sign) {
        this.name = name;
        this.sign = sign;
        this.turns = 0;
        this.incrementTurns = function() {
            this.turns++;
        }
    }

    let player1, player2;
    let currentPlayer;

    form1.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("namePlayer1").value;
        player1 = new Player(name, "X");
        
        form1.style.display = "none";
        
        idPlayer1.style.display = "flex";
        nametagPlayer1.textContent = player1.name;
        checkStartReady();
    })

    form2.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("namePlayer2").value;
        player2 = new Player(name, "O");
        
        form2.style.display = "none";
        
        idPlayer2.style.display = "flex";
        nametagPlayer2.textContent = player2.name;
        checkStartReady();
    })

    function checkStartReady () {
        if (player1 && player2) {
        startBttn.style.display = "block";
        htmlAnnounce.textContent = `Ready to start the game!`;
    }
    }

    startBttn.addEventListener("click", function () {
        currentPlayer = player1;
        board.fill(null);
        htmlBoard.style.display = "grid";
        display();
        winner = null;
        htmlAnnounce.textContent = `${currentPlayer.name} starts the game`;
    });

    function makeMove(i) {
        // check for start button
        if (startBttn.textContent === "Start Game") {
            startBttn.textContent = "Restart";
        }
        // check board at index isn't free or winner already clear
        if (board[i] !== null || winner) {
            htmlAnnounce.textContent = `field already taken, ${currentPlayer.name}, choose other field!`;
            return;
        };

        // update board with players sign
        board[i] = currentPlayer.sign;

        // update display
        display();

        // 	increment turns of currentPlayer;
        currentPlayer.incrementTurns()
        let choice = board[i];

        // check for winner and if console.log, return
        if (checkWin()) {
            htmlAnnounce.textContent = `${currentPlayer.name} is the winner!!`;
            startBttn.addEventListener("click", () => reset());
            startBttn.textContent = "Start new Game"
            return;
        }

        // check for a tie, return
        if (board.every(cell => cell !== null)) {
            console.log("Game over, it's a tie");
            return
        }

        // change to the other player
        switchPlayer()
    }
        

    function checkWin() {
        return winningCombinations.some(([a, b, c]) => {
            if (
                board[a] &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {
                winner = currentPlayer;
                display()
                return true;
            }
            return false;
        });
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        htmlAnnounce.textContent = `It's your turn, ${currentPlayer.name}`
    }

    function reset() {
        board.fill(null);
        display();
        winner = null;
        player1.turns = 0;
        player2.turns = 0;
        currentPlayer = player1;
        console.log("Game reset");
    }

    function display() {
        for (let field of htmlFields) {
            field.textContent = board[field.id];

            field.className = "field"; // Reset

            if (board[field.id] === "X") {
                field.classList.add("blue"); 
            } else if (board[field.id] === "O") {
                field.classList.add("red"); 
            }
        }
    }

    return {
        makeMove,
        reset, 
        getBoard: () => [...board],
        getCurrentPlayer: () => currentPlayer,
        getWinner: () => winner
    }

}

allButtons = document.querySelectorAll(".field");
const game = Game();

for (let button of allButtons) {
    button.addEventListener("click", function(event) {
        game.makeMove(parseInt(event.target.id));
    })
}