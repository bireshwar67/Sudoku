class Sudoku {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
    }

    isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }
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

    isComplete() {
        return this.board.every(row => row.every(cell => cell !== 0));
    }

    checkSolution() {
        return JSON.stringify(this.board) === JSON.stringify(this.solution);
    }
}

class SudokuUI {
    constructor() {
        this.sudoku = null;
        this.startTime = null;
        this.timer = null;
        this.selectedCell = null;
        this.initializeUI();
    }

    initializeUI() {
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('startTimer').addEventListener('click', () => this.startTimer());
        document.getElementById('solve').addEventListener('click', () => this.solve());
        document.getElementById('showLeaderboard').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('saveScore').addEventListener('click', () => this.saveScore());
        document.getElementById('closeWin').addEventListener('click', () => this.closeWinModal());
        document.querySelector('.close').addEventListener('click', () => this.closeLeaderboard());
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.createBoard();
    }

    createBoard() {
        const boardElement = document.getElementById('sudokuBoard');
        boardElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.className = 'cell';
                cell.maxLength = 1;
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => this.selectCell(cell));
                cell.addEventListener('input', (e) => this.handleInput(e));
                
                boardElement.appendChild(cell);
            }
        }
    }

    newGame() {
        const difficulty = document.getElementById('difficulty').value;
        const difficultyMap = { easy: 30, medium: 40, hard: 50 };
        
        this.sudoku = new Sudoku();
        this.sudoku.generatePuzzle(difficultyMap[difficulty] || 40);
        this.updateBoard();
        document.getElementById('status').textContent = 'Game ready! Click "Start Timer" to begin timing.';
    }

    updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = this.sudoku.board[row][col];
            
            cell.value = value || '';
            cell.className = 'cell';
            
            if (value) {
                cell.className += ' given';
                cell.readOnly = true;
            } else {
                cell.readOnly = false;
            }
        });
    }

    selectCell(cell) {
        if (this.selectedCell) {
            this.selectedCell.style.background = '';
        }
        this.selectedCell = cell;
        cell.style.background = '#fff3cd';
    }

    handleInput(e) {
        const cell = e.target;
        const value = parseInt(cell.value);
        
        if (isNaN(value) || value < 1 || value > 9) {
            cell.value = '';
            return;
        }
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (this.sudoku.isValid(this.sudoku.board, row, col, value)) {
            this.sudoku.board[row][col] = value;
            cell.className = 'cell user';
            
            if (this.sudoku.isComplete()) {
                this.stopTimer();
                if (this.sudoku.checkSolution()) {
                    const time = Math.floor((Date.now() - this.startTime) / 1000);
                    this.showWinModal(time);
                } else {
                    document.getElementById('status').textContent = '❌ Solution incorrect!';
                }
            }
        } else {
            cell.value = '';
            cell.className = 'cell invalid';
            setTimeout(() => cell.className = 'cell', 1000);
            document.getElementById('status').textContent = '❌ Invalid move!';
        }
    }

    handleKeyPress(e) {
        if (this.selectedCell && !this.selectedCell.readOnly) {
            if (e.key >= '1' && e.key <= '9') {
                this.selectedCell.value = e.key;
                this.handleInput({ target: this.selectedCell });
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                this.selectedCell.value = '';
            }
        }
    }

    solve() {
        this.sudoku.solve(this.sudoku.board);
        this.updateBoard();
        this.stopTimer();
        document.getElementById('status').textContent = '🤖 Solved using backtracking!';
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('timer').textContent = `Time: ${elapsed}s`;
        }, 1000);
        document.getElementById('status').textContent = 'Timer started! Good luck!';
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    showLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('sudokuLeaderboard') || '[]');
        const sorted = leaderboard.sort((a, b) => a.time - b.time).slice(0, 10);
        
        const listElement = document.getElementById('leaderboardList');
        listElement.innerHTML = sorted.map((entry, index) => 
            `<div class="leaderboard-entry">
                <span>${index + 1}. ${entry.name}</span>
                <span>${entry.time}s (${entry.difficulty})</span>
            </div>`
        ).join('');
        
        document.getElementById('leaderboardModal').style.display = 'block';
    }

    closeLeaderboard() {
        document.getElementById('leaderboardModal').style.display = 'none';
    }

    showWinModal(time) {
        const difficulty = document.getElementById('difficulty').value;
        document.getElementById('winMessage').textContent = 
            `You solved the ${difficulty} puzzle in ${time} seconds!`;
        document.getElementById('winModal').style.display = 'block';
    }

    closeWinModal() {
        document.getElementById('winModal').style.display = 'none';
    }

    saveScore() {
        const name = document.getElementById('playerName').value || 'Anonymous';
        const time = Math.floor((Date.now() - this.startTime) / 1000);
        const difficulty = document.getElementById('difficulty').value;
        
        const leaderboard = JSON.parse(localStorage.getItem('sudokuLeaderboard') || '[]');
        leaderboard.push({ name, time, difficulty, date: new Date().toISOString() });
        localStorage.setItem('sudokuLeaderboard', JSON.stringify(leaderboard));
        
        this.closeWinModal();
        document.getElementById('status').textContent = '✅ Score saved!';
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuUI();
});