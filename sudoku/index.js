import { GameGrid } from 'https://rtdb.nl/bplib/grid.js';
import { animatePiece } from 'https://rtdb.nl/functions.js'

const SIZE = 9;
const EMPTY = 0;

let test = 0;

function isSafe(board, row, col, num) {
    for (let x = 0; x < SIZE; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }
    return true;
}

//dafu this do
function solveSudoku(board) {
    let row = -1;
    let col = -1;
    let isEmpty = true;
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j] === EMPTY) {
                row = i;
                col = j;
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) {
            break;
        }
    }
    if (isEmpty) {
        return true;
    }
    for (let num = 1; num <= SIZE; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
                return true;
            }
            board[row][col] = EMPTY;
        }
    }
    return false;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateCompleteGrid() {
    let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
    let numbers = shuffleArray([...Array(SIZE).keys()].map(x => x + 1));

    // Fill the first row with shuffled numbers
    for (let i = 0; i < SIZE; i++) {
        board[0][i] = numbers[i];
    }
    solveSudoku(board);
    // console.log(board)
    // debugger
    // Randomly shuffle rows within each 3x3 block
    for (let i = 0; i < SIZE; i += 3) {
        let rows = [i, i + 1, i + 2];
        shuffleArray(rows).forEach((row, index) => {
            [board[i + index], board[row]] = [board[row], board[i + index]];
        });
    }

    // Randomly shuffle columns within each 3x3 block
    for (let j = 0; j < SIZE; j += 3) {
        let cols = [j, j + 1, j + 2];
        shuffleArray(cols).forEach((col, index) => {
            for (let row = 0; row < SIZE; row++) {
                [board[row][j + index], board[row][col]] = [board[row][col], board[row][j + index]];
            }
        });
    }

    return board;
}

function removeNumbers(board, numberOfHoles) {
    while (numberOfHoles > 0) {
        let row = Math.floor(Math.random() * SIZE);
        let col = Math.floor(Math.random() * SIZE);
        if (board[row][col] !== EMPTY) {
            let backup = board[row][col];
            board[row][col] = EMPTY;

            let copyBoard = board.map(row => row.slice());
            if (!hasUniqueSolution(copyBoard)) {
                board[row][col] = backup;
            } else {
                numberOfHoles--;
            }
        }
    }
}

function hasUniqueSolution(board) {
    let solutions = 0;

    function solve(board) {
        let row = -1;
        let col = -1;
        let isEmpty = true;
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (board[i][j] === EMPTY) {
                    row = i;
                    col = j;
                    isEmpty = false;
                    break;
                }
            }
            if (!isEmpty) {
                break;
            }
        }
        if (isEmpty) {
            solutions++;
            return;
        }
        for (let num = 1; num <= SIZE && solutions < 2; num++) {
            if (isSafe(board, row, col, num)) {
                board[row][col] = num;
                solve(board);
                board[row][col] = EMPTY;
            }
        }
    }

    solve(board);
    return solutions === 1;
}

let completeGrid = generateCompleteGrid();
console.log('Complete Grid:', completeGrid);

let puzzleGrid = completeGrid.map(row => row.slice());
removeNumbers(puzzleGrid, 40);
console.log('Puzzle Grid:', puzzleGrid);
