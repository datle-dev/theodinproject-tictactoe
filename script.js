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

    const checkThreeInRow = (row, player) => {
        const isThreeInRow = (cell) => cell === player;
        return row.every(isThreeInRow);
    };

    const checkForWin = (player) => {
        const winDirections = {
            'topRow': board[0].map(cell => cell.getValue()),
            'middleRow': board[1].map(cell => cell.getValue()),
            'bottomRow': board[2].map(cell => cell.getValue()),
            'leftColumn': board.map(row => row[0].getValue()),
            'middleColumn': board.map(row => row[1].getValue()),
            'rightColumn': board.map(row => row[2].getValue()),
            'topLeftBottomRight': [board[0][0], board[1][1], board[2][2]].map(cell => cell.getValue()),
            'topRightBottomLeft': [board[0][2], board[1][1], board[2][0]].map(cell => cell.getValue()),
        }

        for (let key of Object.keys(winDirections)) {
            let row = winDirections[key];
            // console.log(`${key}, ${row}`);
            if (checkThreeInRow(row, player)) {
                console.log(`Win along ${key}!`);
                return true;
            }
        }

    };

    return {
        print,
        placeToken,
        getBoard,
        checkForWin,
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

    return {
        printTurn,
        playTurn,
    }

})();

const ScreenController = (function() {

    players = Players;
    board = GameBoard;
    game = GameController;

    const boardButtons = document.querySelectorAll('.board-button');

    function clickHandlerBoard(e) {
        const selectedCell = e.target;

        let row = selectedCell.dataset.row;
        let col = selectedCell.dataset.col;

        game.playTurn(row, col);
        
        updateScreen();
    }

    const initBoard = () => {
        boardButtons.forEach((button) => {
            button.innerText = '';
            button.addEventListener('click', clickHandlerBoard);
        });
        
    }
    
    const updateScreen = () => {
        const boardState = board.getBoard();
        let index = 0;

        boardButtons.forEach((button) => {
            button.innerText = '';
        });

        boardState.forEach(row => {
            row.forEach(cell => {
                // console.log(`${cell.getValue()} at ${boardButtons[index].dataset.row}, ${boardButtons[index].dataset.col}`);
                // console.log(boardButtons[index]);
                if (cell.getValue() !== 0) {
                    boardButtons[index].innerText = cell.getValue();
                }
                index++;
            })
        });

    };

    initBoard();

})();