class SudokuUI {
    constructor() {
        this.board = null;
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

    async newGame() {
        const difficulty = document.getElementById('difficulty').value;
        
        try {
            const response = await fetch('/api/new-game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ difficulty })
            });
            
            const data = await response.json();
            this.board = data.board;
            this.updateBoard();
            document.getElementById('status').textContent = 'Game ready! Click "Start Timer" to begin timing.';
        } catch (error) {
            console.error('Error starting new game:', error);
        }
    }

    updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = this.board[row][col];
            
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

    async handleInput(e) {
        const cell = e.target;
        const value = parseInt(cell.value);
        
        if (isNaN(value) || value < 1 || value > 9) {
            cell.value = '';
            return;
        }
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        try {
            const response = await fetch('/api/make-move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ row, col, num: value })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.board = data.board;
                cell.className = 'cell user';
                
                if (data.isComplete) {
                    this.stopTimer();
                    if (data.isCorrect) {
                        this.showWinModal(data.time);
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
        } catch (error) {
            console.error('Error making move:', error);
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

    async solve() {
        try {
            const response = await fetch('/api/solve', { method: 'POST' });
            const data = await response.json();
            this.board = data.board;
            this.updateBoard();
            this.stopTimer();
            document.getElementById('status').textContent = '🤖 Solved using backtracking!';
        } catch (error) {
            console.error('Error solving puzzle:', error);
        }
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

    async showLeaderboard() {
        try {
            const response = await fetch('/api/leaderboard');
            const leaderboard = await response.json();
            
            const listElement = document.getElementById('leaderboardList');
            listElement.innerHTML = leaderboard.map((entry, index) => 
                `<div class="leaderboard-entry">
                    <span>${index + 1}. ${entry.name}</span>
                    <span>${entry.time}s (${entry.difficulty})</span>
                </div>`
            ).join('');
            
            document.getElementById('leaderboardModal').style.display = 'block';
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        }
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

    async saveScore() {
        const name = document.getElementById('playerName').value || 'Anonymous';
        const time = Math.floor((Date.now() - this.startTime) / 1000);
        const difficulty = document.getElementById('difficulty').value;
        
        try {
            await fetch('/api/save-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, time, difficulty })
            });
            
            this.closeWinModal();
            document.getElementById('status').textContent = '✅ Score saved!';
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuUI();
});