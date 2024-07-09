from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

def is_valid(board, row, col, num):
    if num in board[row]:
        return False
    if num in [board[i][col] for i in range(9)]:
        return False
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(start_row, start_row + 3):
        for j in range(start_col, start_col + 3):
            if board[i][j] == num:
                return False
    return True

def solve_sudoku(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                for num in range(1, 10):
                    if is_valid(board, row, col, num):
                        board[row][col] = num
                        if solve_sudoku(board):
                            return True
                        board[row][col] = 0
                return False
    return True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/solve', methods=['GET'])
def solve():
    board = []
    for i in range(9):
        row = []
        for j in range(9):
            value = request.args.get(f'cell_{i}_{j}', 0, type=int)
            row.append(value)
        board.append(row)
    
    if solve_sudoku(board):
        return jsonify({'solved': True, 'board': board})
    else:
        return jsonify({'solved': False})

if __name__ == '__main__':
    app.run(debug=True)
