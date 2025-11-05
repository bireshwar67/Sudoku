const SudokuGame = require('./game');

const game = new SudokuGame();
game.playGame().catch(console.error);