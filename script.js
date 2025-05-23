function Game() {
    //create array board, empty items
    const board = Array(9).fill(null)

    // display in html
    htmlFields = document.getElementsByClassName("field");

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

    const player1 = new Player("Michael", "X");
    const player2 = new Player("Susan", "O");
    let currentPlayer = player1;

    function makeMove(i) {
        // check board at index isn't free or winner already clear
        if (board[i] !== null || winner) {
            alert("field already taken");
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
            console.log(`winner is: ${currentPlayer.name}`);
            reset();
            return;
        }

        // check for a tie, return
        if (board.every(cell => cell !== null)) {
            console.log("Game over, it's a tie");
            return
        }

        console.log(board);

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
                return true;
            }
            return false;
        });
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
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

allButtons = document.getElementsByClassName("field");
const game = Game();

for (let button of allButtons) {
    button.addEventListener("click", function(event) {
        game.makeMove(parseInt(event.target.id));
    })
}