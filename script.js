// =========================
// GAMEBOARD
// =========================

const Gameboard = {

    board: ["", "", "", "", "", "", "", "", ""],

    getBoard() {
        return this.board;
    },

    placeMarker(index, marker) {

        if (this.board[index] === "") {
            this.board[index] = marker;
        }

    },

    reset() {
        this.board.fill("");
    }

};


// =========================
// PLAYER
// =========================

const createPlayer = (name, marker) => {

    return {
        name,
        marker
    };

};


// =========================
// WINNING COMBINATIONS
// =========================

const winningCombinations = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


// =========================
// GAME CONTROLLER
// =========================

const GameController = {

    player1: createPlayer("Player 1", "X"),

    player2: createPlayer("Player 2", "O"),

    currentPlayer: null,

    gameOver: false,

    winner: null,

    gameStarted: false,


    playRound(index) {

        if (!this.gameStarted) {
            return;
        }

        if (this.gameOver) {
            return;
        }


        const board = Gameboard.getBoard();


        if (board[index] !== "") {
            return;
        }


        Gameboard.placeMarker(
            index,
            this.currentPlayer.marker
        );


        const winner = this.checkWinner();


        if (winner) {

            this.winner = this.currentPlayer;

            this.gameOver = true;

            return;
        }


        if (this.checkTie()) {

            this.gameOver = true;

            return;
        }


        this.currentPlayer =
            this.currentPlayer === this.player1
                ? this.player2
                : this.player1;

    },


    checkWinner() {

        const board = Gameboard.getBoard();


        for (const combination of winningCombinations) {

            const [a, b, c] = combination;


            if (
                board[a] !== "" &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {

                return board[a];

            }

        }


        return null;

    },


    checkTie() {

        return Gameboard
            .getBoard()
            .every(cell => cell !== "");

    }

};


GameController.currentPlayer =
    GameController.player1;


// =========================
// DISPLAY CONTROLLER
// =========================

const DisplayController = {

    gameboardElement:
        document.querySelector(".gameboard"),

    turnDisplay:
        document.querySelector("#turn-display"),

    resultDisplay:
        document.querySelector("#result"),

    playerOneInput:
        document.querySelector("#player-one"),

    playerTwoInput:
        document.querySelector("#player-two"),

    startButton:
        document.querySelector("#start-button"),

    restartButton:
        document.querySelector("#restart-button"),


    displayTurn() {

        this.turnDisplay.textContent =
            `${GameController.currentPlayer.name}'s turn`;

    },


    displayResult() {

        if (GameController.winner) {

            this.resultDisplay.textContent =
                `${GameController.winner.name} wins!`;

        }

        else if (GameController.gameOver) {

            this.resultDisplay.textContent =
                "It's a tie!";

        }

    },


    render() {

        const board =
            Gameboard.getBoard();


        this.gameboardElement.innerHTML = "";


        board.forEach((cell, index) => {

            const cellElement =
                document.createElement("button");


            cellElement.classList.add("cell");


            cellElement.dataset.index =
                index;


            cellElement.textContent =
                cell;


            cellElement.addEventListener(
                "click",
                () => {

                    GameController.playRound(index);

                    this.render();

                    this.displayResult();


                    if (!GameController.gameOver) {

                        this.displayTurn();

                    }

                }
            );


            this.gameboardElement
                .appendChild(cellElement);

        });

    },


    startGame() {

        const playerOneName =
            this.playerOneInput.value.trim();

        const playerTwoName =
            this.playerTwoInput.value.trim();


        if (playerOneName === "") {
            return;
        }


        if (playerTwoName === "") {
            return;
        }


        GameController.player1.name =
            playerOneName;

        GameController.player2.name =
            playerTwoName;


        GameController.gameStarted =
            true;

        GameController.gameOver =
            false;

        GameController.winner =
            null;

        GameController.currentPlayer =
            GameController.player1;


        Gameboard.reset();


        this.resultDisplay.textContent =
            "";


        this.render();

        this.displayTurn();

    },


    restartGame() {

        Gameboard.reset();

        GameController.gameStarted =
            true;

        GameController.gameOver =
            false;

        GameController.winner =
            null;

        GameController.currentPlayer =
            GameController.player1;


        this.resultDisplay.textContent =
            "";


        this.render();

        this.displayTurn();

    }

};


// =========================
// BUTTON EVENTS
// =========================

DisplayController.startButton
    .addEventListener("click", () => {

        DisplayController.startGame();

    });


DisplayController.restartButton
    .addEventListener("click", () => {

        DisplayController.restartGame();

    });


// =========================
// INITIAL DISPLAY
// =========================

DisplayController.render();



