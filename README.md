# 🎮 Sudoku Game with Backtracking Algorithm

A full-stack web application implementing Sudoku with advanced backtracking algorithm for puzzle generation and solving, featuring real-time gameplay and competitive leaderboard.

Feel free to play the game anytime at https://bireshwar67.github.io/Sudoku/

## 🏗️ Architecture & Design

### **Frontend (Client-Side)**
- **HTML5**: Semantic structure with modal dialogs
- **CSS3**: Responsive grid layout with visual 3x3 box separation
- **Vanilla JavaScript**: Complete game logic with backtracking algorithm
- **LocalStorage**: Persistent leaderboard storage

### **Data Flow**
```
User Input → Sudoku Engine → DOM Update → LocalStorage
```

## 🧠 Backtracking Algorithm Implementation

### **Puzzle Generation Process:**
1. **Fill Complete Board**: Use backtracking to create valid 9x9 solution
2. **Store Solution**: Keep complete solution for validation
3. **Remove Cells**: Randomly remove numbers based on difficulty
4. **Validate Uniqueness**: Ensure single solution exists

### **Solving Algorithm:**
```javascript
function solve(board) {
    for each empty cell {
        for numbers 1-9 {
            if (isValid(number, position)) {
                place number
                if (solve recursively) return true
                backtrack (remove number)
            }
        }
        return false // no solution found
    }
    return true // puzzle solved
}
```

### **Validation Logic:**
- **Row Check**: No duplicate numbers in same row
- **Column Check**: No duplicate numbers in same column  
- **Box Check**: No duplicate numbers in 3x3 subgrid

## 🎯 Game Flow & User Experience

### **Game Initialization**
```
User Opens App → Select Difficulty → Generate Puzzle → Display Grid
```

### **Gameplay Loop**
```
Study Puzzle → Start Timer → Make Moves → Validate Input → Check Completion
                ↓
        Complete? → Save Score → Update Leaderboard
```

### **Timer System Design**
- **Preparation Phase**: Study puzzle without time pressure
- **Active Phase**: Manual timer start for fair competition
- **Completion**: Automatic timer stop and score calculation

## 🚀 Installation & Setup

```bash
# Start simple HTTP server
npm start
# → Open http://localhost:3000

# Or open index.html directly in browser
open public/index.html

# Run console version
npm run console
```

## 🎮 How to Play

### **Web Interface Workflow:**
1. **Setup**: Choose difficulty (Easy: 30 blanks, Medium: 40, Hard: 50)
2. **Generate**: Click "New Game" to create puzzle using backtracking
3. **Prepare**: Study the puzzle layout and plan strategy
4. **Start**: Click "Start Timer" when ready for timed play
5. **Play**: Click cells and enter numbers (1-9)
6. **Validate**: Real-time validation prevents invalid moves
7. **Complete**: Solve puzzle to trigger win condition
8. **Score**: Save time to persistent leaderboard

### **Input Methods:**
- **Mouse**: Click cell + type number
- **Keyboard**: Arrow keys + number keys for speed
- **Auto-solve**: Backtracking algorithm solves instantly

## 📁 Project Structure

```
sudoku_game/
├── game.js            # Console game interface
├── index.js           # Console entry point
├── sudoku.js          # Core backtracking algorithm (console)
├── public/
│   ├── index.html     # Web UI structure
│   ├── style.css      # Responsive styling
│   └── script.js      # Complete game logic + UI
├── package.json       # Scripts for serving
└── README.md          # Documentation
```

## 🔧 Core Functions

| Function | Purpose |
|----------|----------|
| `generatePuzzle()` | Generate puzzle with backtracking |
| `isValid()` | Validate move against Sudoku rules |
| `solve()` | Auto-solve using backtracking |
| `showLeaderboard()` | Display top 10 scores from localStorage |
| `saveScore()` | Save completion time to localStorage |

## 🏆 Features

- ✅ **Backtracking Algorithm**: Generates & solves puzzles recursively
- ✅ **Real-time Validation**: Instant feedback on move validity
- ✅ **Visual Design**: Clear 3x3 box separation with responsive grid
- ✅ **Timer System**: Fair timing with manual start
- ✅ **Persistent Leaderboard**: LocalStorage-based score tracking
- ✅ **Multiple Interfaces**: Web UI + Console version
- ✅ **Difficulty Levels**: Configurable puzzle complexity
- ✅ **Auto-solve**: Demonstrate backtracking algorithm

## 🎯 Technical Highlights

- **Algorithm Efficiency**: O(9^(empty_cells)) time complexity with pruning
- **Memory Management**: Minimal state storage with efficient backtracking
- **User Experience**: Responsive design with immediate feedback
- **Data Persistence**: Browser localStorage with JSON serialization
- **Error Handling**: Graceful validation and user guidance
