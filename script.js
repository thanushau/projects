document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sudoku-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Collect the board data
        const board = [];
        for (let i = 0; i < 9; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                const cell = form.querySelector(`input[name="cell_${i}_${j}"]`).value;
                row.push(cell ? parseInt(cell, 10) : 0);
            }
            board.push(row);
        }

        // Create query string from board data
        const queryString = board.flat().map((value, index) => `cell${index}=${value}`).join('&');

        // Call the backend to solve the Sudoku
        const response = await fetch(`/solve?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.solved) {
            // Update the board with the solution
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    form.querySelector(`input[name="cell_${i}_${j}"]`).value = data.board[i][j];
                }
            }
            document.getElementById('result').innerText = 'Sudoku solved!';
        } else {
            document.getElementById('result').innerText = 'No solution exists';
        }
    });
});
