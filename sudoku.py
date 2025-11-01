import random
import time

class Sudoku:
    def __init__(self):
        self.board = [[0 for _ in range(9)] for _ in range(9)]
        self.solution = [[0 for _ in range(9)] for _ in range(9)]
        
    def is_valid(self, board, row, col, num):
        # Check row
        for x in range(9):
            if board[row][x] == num:
                return False
        
        # Check column
        for x in range(9):
            if board[x][col] == num:
                return False
        
        # Check 3x3 box
        start_row = row - row % 3
        start_col = col - col % 3
        for i in range(3):
            for j in range(3):
                if board[i + start_row][j + start_col] == num:
                    return False
        
        return True
    
    def solve(self, board):
        for i in range(9):
            for j in range(9):
                if board[i][j] == 0:
                    for num in range(1, 10):
                        if self.is_valid(board, i, j, num):
                            board[i][j] = num
                            if self.solve(board):
                                return True
                            board[i][j] = 0
                    return False
        return True
    
    def generate_puzzle(self, difficulty=40):
        # Generate complete solution
        self.fill_board()
        self.solution = [row[:] for row in self.board]
        
        # Remove numbers based on difficulty
        cells_to_remove = difficulty
        while cells_to_remove > 0:
            row = random.randint(0, 8)
            col = random.randint(0, 8)
            if self.board[row][col] != 0:
                self.board[row][col] = 0
                cells_to_remove -= 1
    
    def fill_board(self):
        numbers = list(range(1, 10))
        for i in range(9):
            for j in range(9):
                if self.board[i][j] == 0:
                    random.shuffle(numbers)
                    for num in numbers:
                        if self.is_valid(self.board, i, j, num):
                            self.board[i][j] = num
                            if self.solve(self.board):
                                break
                            self.board[i][j] = 0
                    else:
                        return False
        return True
    
    def print_board(self):
        for i in range(9):
            if i % 3 == 0 and i != 0:
                print("------+-------+------")
            for j in range(9):
                if j % 3 == 0 and j != 0:
                    print("| ", end="")
                print(self.board[i][j] if self.board[i][j] != 0 else ".", end=" ")
            print()
    
    def is_complete(self):
        for i in range(9):
            for j in range(9):
                if self.board[i][j] == 0:
                    return False
        return True
    
    def check_solution(self):
        return self.board == self.solution