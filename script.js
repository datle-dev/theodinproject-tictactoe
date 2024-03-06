// player object
const Players = (function() {
    const players = [
        {name: 'Player 1', token: 1,},
        {name: 'Player 2', token: 2,},
    ];

    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    const getActivePlayer = () => {
        return activePlayer;
    }

    return {
        getActivePlayer,
        switchPlayer,
    }

})();

const Cell = (function() {
    let value = 0;
    let win = false;

    const setToken = (player) => {
        value = player;
    };

    const getValue = () => {
        return value;
    };

    return {
        setToken,
        getValue,
    }

});

const GameBoard = (function() {
    let board = [];
    let win = false;

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }

    const print = () => {
        const boardValues = board.map(row => row.map(cell => cell.getValue()));
        boardValues.forEach(row => console.log(row));
    };

    const placeToken = (row, col, player) => {
        if (board[row][col].getValue() !== 0) {
            throw new Error('Cannot place token there');
        } else {
            board[row][col].setToken(player);
        }
    };

    const getBoard = () => board;

    const getWin = () => win;

    const checkThreeInRow = (row, player) => {
        const isThreeInRow = (cell) => cell.getValue() === player;
        return row.every(isThreeInRow);
    };

    const checkForWin = (player) => {
        const winDirections = {
            'topRow': board[0].map(cell => cell),
            'middleRow': board[1].map(cell => cell),
            'bottomRow': board[2].map(cell => cell),
            'leftColumn': board.map(row => row[0]),
            'middleColumn': board.map(row => row[1]),
            'rightColumn': board.map(row => row[2]),
            'topLeftBottomRight': [board[0][0], board[1][1], board[2][2]],
            'topRightBottomLeft': [board[0][2], board[1][1], board[2][0]],
        }

        for (let key of Object.keys(winDirections)) {
            let row = winDirections[key];
            // console.log(`${key}, ${row}`);
            if (checkThreeInRow(row, player)) {
                console.log(`Win along ${key}!`);
                row.forEach(cell => cell.win = true);
                win = true;
                return true;
            }
        }

    };

    return {
        print,
        placeToken,
        getBoard,
        checkForWin,
        getWin,
    }

})();

const GameController = (function() {
    let name;
    let token;
    let turnCount = 0;


    const printTurn = () => {
        console.log(`Turn ${turnCount}: ${Players.getActivePlayer().name}'s turn`);
    };

    const playTurn = (row, col) => {
        name = Players.getActivePlayer().name;
        token = Players.getActivePlayer().token;

        turnCount++;
        
        printTurn();
        GameBoard.placeToken(row, col, token);

        if (GameBoard.checkForWin(token)) {
            console.log(`${name} wins!`);
            return;
        } else if (turnCount === 9) {
            console.log(`Match ends in a tie!`);
            return;
        }

        Players.switchPlayer();
    };

    const getTurnCount = () => turnCount;

    return {
        printTurn,
        playTurn,
        getTurnCount,
    }

})();

const ScreenController = (function() {

    players = Players;
    board = GameBoard;
    game = GameController;

    const turnDisplay = document.querySelector('#turn');
    const boardButtons = document.querySelectorAll('.board-button');

    function clickHandlerBoard(e) {
        const selectedCell = e.target;

        let row = selectedCell.dataset.row;
        let col = selectedCell.dataset.col;

        game.playTurn(row, col);
        
        updateScreen();

        if (board.getWin()) {
            endGame();
            turnDisplay.innerText = `Game over! ${players.getActivePlayer().name} wins!`;
        } else if (game.getTurnCount() === 9) {
            endGame();
            turnDisplay.innerText = `Game over! Tie!`;
        }
    }

    const initBoard = () => {
        boardButtons.forEach((button) => {
            button.innerText = '';
            button.addEventListener('click', clickHandlerBoard);
        });
        turnDisplay.innerText = `${players.getActivePlayer().name}'s turn`;
    }
    
    const endGame = () => {
        boardButtons.forEach((button) => {
            button.removeEventListener('click', clickHandlerBoard);
        });
    };

    const updateScreen = () => {
        const boardState = board.getBoard();
        let index = 0;

        turnDisplay.innerText = `${players.getActivePlayer().name}'s turn`;
        boardButtons.forEach((button) => {
            button.innerText = '';
        });

        boardState.forEach(row => {
            row.forEach(cell => {
                if (cell.getValue() !== 0) {
                    boardButtons[index].innerText = (cell.getValue() === 1) ? 'X' : 'O';
                    if (cell.win) {
                        boardButtons[index].style.color = 'white';
                        boardButtons[index].style.fontWeight = 'bold';
                        boardButtons[index].style.backgroundColor = 'green';
                    }
                }
                index++;
            })
        });

    };

    initBoard();

})();