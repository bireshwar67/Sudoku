class Sudoku {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
    }

    isValid(board, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] === num) return false;
            }
        }
        
        return true;
    }

    solve(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValid(board, i, j, num)) {
                            board[i][j] = num;
                            if (this.solve(board)) return true;
                            board[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    generatePuzzle(difficulty = 40) {
        this.fillBoard();
        this.solution = this.board.map(row => [...row]);
        
        let cellsToRemove = difficulty;
        while (cellsToRemove > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                cellsToRemove--;
            }
        }
    }

    fillBoard() {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0) {
                    const shuffled = numbers.sort(() => Math.random() - 0.5);
                    for (const num of shuffled) {
                        if (this.isValid(this.board, i, j, num)) {
                            this.board[i][j] = num;
                            if (this.solve(this.board)) break;
                            this.board[i][j] = 0;
                        }
                    }
                }
            }
        }
    }

    printBoard() {
        for (let i = 0; i < 9; i++) {
            if (i % 3 === 0 && i !== 0) console.log("------+-------+------");
            let row = "";
            for (let j = 0; j < 9; j++) {
                if (j % 3 === 0 && j !== 0) row += "| ";
                row += (this.board[i][j] || ".") + " ";
            }
            console.log(row);
        }
    }

    isComplete() {
        return this.board.every(row => row.every(cell => cell !== 0));
    }

    checkSolution() {
        return JSON.stringify(this.board) === JSON.stringify(this.solution);
    }
}

module.exports = Sudoku;