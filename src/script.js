class Sudoku {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.mistakes = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.initializeGame();
    }

    initializeGame() {
        this.generateSolution();
        this.createPuzzle();
        this.renderBoard();
        this.startTimer();
        this.setupEventListeners();
    }

    generateSolution() {
        // Basit bir çözüm üreteci
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.solution[i][j] = (i * 3 + Math.floor(i / 3) + j) % 9 + 1;
            }
        }

        // Rastgele karıştırma
        for (let i = 0; i < 20; i++) {
            this.shuffleBoard();
        }
    }

    shuffleBoard() {
        // Satırları karıştır
        const row1 = Math.floor(Math.random() * 9);
        const row2 = Math.floor(row1 / 3) * 3 + (row1 + 1) % 3;
        for (let j = 0; j < 9; j++) {
            [this.solution[row1][j], this.solution[row2][j]] = 
            [this.solution[row2][j], this.solution[row1][j]];
        }
    }

    createPuzzle() {
        // Çözümü kopyala
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.board[i][j] = this.solution[i][j];
            }
        }

        // Rastgele hücreleri boşalt
        const difficulty = {
            easy: 40,
            medium: 50,
            hard: 60
        };

        const cellsToRemove = difficulty[document.getElementById('difficulty').value];
        for (let i = 0; i < cellsToRemove; i++) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            this.board[row][col] = 0;
        }
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (this.board[i][j] !== 0) {
                    cell.textContent = this.board[i][j];
                    cell.classList.add('fixed');
                }

                if ((i + 1) % 3 === 0 && i !== 8) {
                    cell.style.borderBottom = '2px solid #1f2937';
                }
                if ((j + 1) % 3 === 0 && j !== 8) {
                    cell.style.borderRight = '2px solid #1f2937';
                }

                boardElement.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        // Hücre seçimi
        document.getElementById('board').addEventListener('click', (e) => {
            if (e.target.classList.contains('cell') && !e.target.classList.contains('fixed')) {
                if (this.selectedCell) {
                    this.selectedCell.classList.remove('selected');
                }
                this.selectedCell = e.target;
                this.selectedCell.classList.add('selected');
            }
        });

        // Numara girişi
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                if (this.selectedCell && !this.selectedCell.classList.contains('fixed')) {
                    const row = parseInt(this.selectedCell.dataset.row);
                    const col = parseInt(this.selectedCell.dataset.col);
                    const number = button.dataset.number;

                    if (button.classList.contains('erase')) {
                        this.board[row][col] = 0;
                        this.selectedCell.textContent = '';
                        this.selectedCell.classList.remove('error');
                    } else {
                        this.board[row][col] = parseInt(number);
                        this.selectedCell.textContent = number;

                        if (this.board[row][col] !== this.solution[row][col]) {
                            this.selectedCell.classList.add('error');
                            this.mistakes++;
                            document.getElementById('mistakes').textContent = this.mistakes;
                        } else {
                            this.selectedCell.classList.remove('error');
                        }
                    }

                    if (this.checkWin()) {
                        this.gameWon();
                    }
                }
            });
        });

        // Yeni oyun
        document.getElementById('newGame').addEventListener('click', () => {
            this.resetGame();
        });

        // Çözüm
        document.getElementById('solve').addEventListener('click', () => {
            this.solveBoard();
        });
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.timer = 0;
        this.updateTimer();
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        document.getElementById('time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    checkWin() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    gameWon() {
        clearInterval(this.timerInterval);
        alert('Tebrikler! Sudokuyu çözdünüz!');
    }

    resetGame() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.mistakes = 0;
        document.getElementById('mistakes').textContent = '0';
        this.initializeGame();
    }

    solveBoard() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.board[i][j] = this.solution[i][j];
            }
        }
        this.renderBoard();
        this.gameWon();
    }
}

// Oyunu başlat
window.addEventListener('DOMContentLoaded', () => {
    new Sudoku();
});