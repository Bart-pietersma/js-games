import { GameGrid } from 'https://rtdb.nl/bplib/grid.js';
import { animatePiece } from 'https://rtdb.nl/functions.js'


/*
a simple sudoku game that only validates the win at the end

future plans
add dificulty 
more feedback for player higlight wrong earlyer

a temp selector


*/

const SIZE = 9;
const EMPTY = 0;
class SudokuGame extends HTMLElement{
    constructor(){
        super()
        //building the game visuals
        this.grid = new GameGrid(9,9);
        this.append(this.grid);
        this.selectBar = document.createElement('div');
        this.selectBar.id = 'selectbar';
        for(let x = 1 ; x <=9 ; x++){
            const block = document.createElement('div');
            block.setAttribute('number',x);
            block.innerText = x;
            this.selectBar.append(block);
        }
        this.append(this.selectBar);


        let completeGrid = this.generateCompleteGrid();
        this.solution = completeGrid;
        console.log(completeGrid);
        let puzzleGrid = completeGrid.map(row => row.slice());
        this.removeNumbers(puzzleGrid, 40);
        //put the puzzle in the grid
        for(let x = 0 ; x < this.grid.grid.length; x++){
            if(puzzleGrid.flat()[x] !== 0) this.grid.grid[x].innerText  = puzzleGrid.flat()[x];
            else this.grid.grid[x].toggleAttribute('userValid', true);
        }
        
    }

    get userPuzzle(){
        return this.grid.rows.map(row => row.map(div => {
            //make the string into a number and empty into a 0
            return div.innerText.length == 1 ? +div.innerText : 0 ;
        }));
    }

    get isFull(){
        const cells = this.grid.grid.filter( cell => cell.isEmpty)
        return cells.length > 0 ? false : true;
    }

    connectedCallback() {
        this.addEventListener('click', e => this.handleClickEvent(e));
    }

    handleClickEvent(e){
        const target = e.target;
        const number = this.querySelector('[selected]')?.innerText
        //check for selecting number
        if(target.hasAttribute('number')){
            //toggle the old selected off
            if(+target.innerText != number)this.querySelector(`[number="${number}"]`)?.toggleAttribute('selected',false);

            //toggle new selected and higlight the number on the board
            target.toggleAttribute(`selected`);
            const targetNumber = target.innerText;
            this.grid.grid.map(tile => tile.hasAttribute('selected') && tile.toggleAttribute(`selected`));
            if(target.hasAttribute(`selected`))this.grid.grid.map(tile => tile.innerText == targetNumber && tile.toggleAttribute(`selected`));
        }
        //check for adding number
        else if(target.hasAttribute('userValid') && number){
            //todo use the safe for correct or not visual placement
            const safe = this.isSafe(this.userPuzzle,target.y,target.x,+number);

            //check if number is same then remove
            target.toggleAttribute(`selected`);
            if(target.innerText == number) target.innerText = '';
            else target.innerText = number;

            if(this.isFull) this.checkPuzzle() ? this.handleWin() : this.handleLoss();
        }
    }

    checkPuzzle(){
        //check if the puzzle is correct by compering it with the original
        return this.solution.toString() == this.userPuzzle.toString() ? true : false;
    }

    handleWin(){
        console.log(`u won`);
    }
    handleLoss(){
        console.log(`u lost`);
    }



    isSafe(board, row, col, num) {
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
    
    solveSudoku(board) {
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
            if (this.isSafe(board, row, col, num)) {
                board[row][col] = num;
                if (this.solveSudoku(board)) {
                    return true;
                }
                board[row][col] = EMPTY;
            }
        }
        return false;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    generateCompleteGrid() {
        let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
        let numbers = this.shuffleArray([...Array(SIZE).keys()].map(x => x + 1));
    
        // Fill the first row with shuffled numbers
        for (let i = 0; i < SIZE; i++) {
            board[0][i] = numbers[i];
        }
        this.solveSudoku(board);
    
        // Randomly shuffle rows within each 3x3 block
        for (let i = 0; i < SIZE; i += 3) {
            let rows = [i, i + 1, i + 2];
            this.shuffleArray(rows).forEach((row, index) => {
                [board[i + index], board[row]] = [board[row], board[i + index]];
            });
        }
    
        // Randomly shuffle columns within each 3x3 block
        for (let j = 0; j < SIZE; j += 3) {
            let cols = [j, j + 1, j + 2];
            this.shuffleArray(cols).forEach((col, index) => {
                for (let row = 0; row < SIZE; row++) {
                    [board[row][j + index], board[row][col]] = [board[row][col], board[row][j + index]];
                }
            });
        }
    
        return board;
    }
    
    removeNumbers(board, numberOfHoles) {
        while (numberOfHoles > 0) {
            let row = Math.floor(Math.random() * SIZE);
            let col = Math.floor(Math.random() * SIZE);
            if (board[row][col] !== EMPTY) {
                let backup = board[row][col];
                board[row][col] = EMPTY;
    
                let copyBoard = board.map(row => row.slice());
                if (!this.hasUniqueSolution(copyBoard)) {
                    board[row][col] = backup;
                } else {
                    numberOfHoles--;
                }
            }
        }
    }

    
    
    hasUniqueSolution(board) {
        let solutions = 0;
    
        const solve = (board) => {
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
                if (this.isSafe(board, row, col, num)) {
                    board[row][col] = num;
                    solve(board);
                    board[row][col] = EMPTY;
                }
            }
        }
    
        solve(board);
        return solutions === 1;
    }

}
customElements.define('sudoku-game',SudokuGame);









//! chat gbt below
/*


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
*/

// let completeGrid = generateCompleteGrid();
// console.log('Complete Grid:', completeGrid);

// let puzzleGrid = completeGrid.map(row => row.slice());
// removeNumbers(puzzleGrid, 40);
// console.log('Puzzle Grid:', puzzleGrid);
