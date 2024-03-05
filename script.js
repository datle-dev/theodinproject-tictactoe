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
    const board = GameBoard;
    const players = Players;

    const printRound = () => {
        console.log(`${players.getActivePlayer().name}'s turn`);
    };

    // // player 1 win along column 1
    // let move1 = [0, 0];
    // let move2 = [2, 2];
    // let move3 = [2, 0];
    // let move4 = [2, 1];
    // let move5 = [1, 0];

    // let moves = [
    //     move1,
    //     move2,
    //     move3,
    //     move4,
    //     move5,
    // ]

    // // player 2 win along diagonal top left to bottom right
    // let move1 = [0, 2];
    // let move2 = [0, 0];
    // let move3 = [1, 0];
    // let move4 = [1, 1];
    // let move5 = [2, 0];
    // let move6 = [2, 2];

    // let moves = [
    //     move1,
    //     move2,
    //     move3,
    //     move4,
    //     move5,
    //     move6,
    // ]

    // player 1 win on last move along bottom row
    // accidentally wins on move 7 from top right to bottom left
    let move1 = [2, 0];
    let move2 = [0, 0];
    let move3 = [1, 1];
    let move4 = [0, 1];
    let move5 = [2, 1];
    let move6 = [1, 2];
    let move7 = [0, 2];
    let move8 = [1, 0];
    let move9 = [2, 2];

    let moves = [
        move1,
        move2,
        move3,
        move4,
        move5,
        move6,
        move7,
        move8,
        move9,
    ]
    let count = 0;
    for (let move of moves) {
        count += 1;
        console.log(`Turn ${count}`);
        printRound();
        console.log(`Placing at ${move}...`);
        board.placeToken(...move, players.getActivePlayer().token);
        board.print();

        if (board.checkForWin(players.getActivePlayer().token)) {
            console.log(`${players.getActivePlayer().name} wins!`);
            return;
        };

        players.switchPlayer();
    };


})();
