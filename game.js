const fs = require('fs');
const readline = require('readline');
const Sudoku = require('./sudoku');

class SudokuGame {
    constructor() {
        this.sudoku = new Sudoku();
        this.startTime = null;
        this.leaderboard = this.loadLeaderboard();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    loadLeaderboard() {
        try {
            return JSON.parse(fs.readFileSync('leaderboard.json', 'utf8'));
        } catch {
            return [];
        }
    }

    saveLeaderboard() {
        fs.writeFileSync('leaderboard.json', JSON.stringify(this.leaderboard, null, 2));
    }

    showLeaderboard() {
        console.log('\n🏆 LEADERBOARD 🏆');
        console.log('Rank | Name     | Time    | Difficulty');
        console.log('-----|----------|---------|----------');
        this.leaderboard
            .sort((a, b) => a.time - b.time)
            .slice(0, 10)
            .forEach((entry, i) => {
                console.log(`${(i + 1).toString().padStart(4)} | ${entry.name.padEnd(8)} | ${entry.time}s | ${entry.difficulty}`);
            });
    }

    async getInput(prompt) {
        return new Promise(resolve => this.rl.question(prompt, resolve));
    }

    async playGame() {
        console.log('🎮 SUDOKU GAME WITH BACKTRACKING 🎮\n');
        
        const difficulty = await this.getInput('Choose difficulty (1=Easy, 2=Medium, 3=Hard): ');
        const difficultyMap = { '1': 30, '2': 40, '3': 50 };
        const difficultyName = { '1': 'Easy', '2': 'Medium', '3': 'Hard' };
        
        this.sudoku.generatePuzzle(difficultyMap[difficulty] || 40);
        this.startTime = Date.now();
        
        console.log('\nInitial puzzle:');
        this.sudoku.printBoard();
        console.log('\nEnter moves as: row col number (1-9) or "solve" to auto-solve or "quit" to exit');

        while (!this.sudoku.isComplete()) {
            const input = await this.getInput('\nYour move: ');
            
            if (input === 'quit') break;
            if (input === 'solve') {
                this.sudoku.solve(this.sudoku.board);
                console.log('\nSolved puzzle:');
                this.sudoku.printBoard();
                break;
            }

            const [row, col, num] = input.split(' ').map(Number);
            if (row >= 1 && row <= 9 && col >= 1 && col <= 9 && num >= 1 && num <= 9) {
                if (this.sudoku.isValid(this.sudoku.board, row - 1, col - 1, num)) {
                    this.sudoku.board[row - 1][col - 1] = num;
                    console.log('\nCurrent board:');
                    this.sudoku.printBoard();
                } else {
                    console.log('❌ Invalid move!');
                }
            } else {
                console.log('❌ Invalid format! Use: row col number');
            }
        }

        if (this.sudoku.isComplete() && this.sudoku.checkSolution()) {
            const time = Math.floor((Date.now() - this.startTime) / 1000);
            console.log(`\n🎉 Congratulations! Solved in ${time} seconds!`);
            
            const name = await this.getInput('Enter your name for leaderboard: ');
            this.leaderboard.push({
                name: name || 'Anonymous',
                time,
                difficulty: difficultyName[difficulty] || 'Medium'
            });
            this.saveLeaderboard();
        }

        this.showLeaderboard();
        this.rl.close();
    }
}

module.exports = SudokuGame;