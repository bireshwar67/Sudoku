const express = require('express');
const fs = require('fs');
const path = require('path');
const Sudoku = require('./sudoku');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

let currentGame = null;
let startTime = null;

// Load leaderboard
function loadLeaderboard() {
    try {
        return JSON.parse(fs.readFileSync('leaderboard.json', 'utf8'));
    } catch {
        return [];
    }
}

function saveLeaderboard(leaderboard) {
    fs.writeFileSync('leaderboard.json', JSON.stringify(leaderboard, null, 2));
}

// API Routes
app.post('/api/new-game', (req, res) => {
    const { difficulty } = req.body;
    const difficultyMap = { easy: 30, medium: 40, hard: 50 };
    
    currentGame = new Sudoku();
    currentGame.generatePuzzle(difficultyMap[difficulty] || 40);
    startTime = Date.now();
    
    res.json({ board: currentGame.board });
});

app.post('/api/make-move', (req, res) => {
    const { row, col, num } = req.body;
    
    if (!currentGame) {
        return res.status(400).json({ error: 'No active game' });
    }
    
    if (currentGame.isValid(currentGame.board, row, col, num)) {
        currentGame.board[row][col] = num;
        const isComplete = currentGame.isComplete();
        const isCorrect = isComplete && currentGame.checkSolution();
        
        res.json({ 
            success: true, 
            board: currentGame.board,
            isComplete,
            isCorrect,
            time: isComplete ? Math.floor((Date.now() - startTime) / 1000) : null
        });
    } else {
        res.json({ success: false, error: 'Invalid move' });
    }
});

app.post('/api/solve', (req, res) => {
    if (!currentGame) {
        return res.status(400).json({ error: 'No active game' });
    }
    
    currentGame.solve(currentGame.board);
    res.json({ board: currentGame.board });
});

app.get('/api/leaderboard', (req, res) => {
    const leaderboard = loadLeaderboard();
    res.json(leaderboard.sort((a, b) => a.time - b.time).slice(0, 10));
});

app.post('/api/save-score', (req, res) => {
    const { name, time, difficulty } = req.body;
    const leaderboard = loadLeaderboard();
    
    leaderboard.push({ name, time, difficulty, date: new Date().toISOString() });
    saveLeaderboard(leaderboard);
    
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🎮 Sudoku game running at http://localhost:${PORT}`);
});