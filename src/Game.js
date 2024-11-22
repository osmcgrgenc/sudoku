import { Board } from './modules/Board.js';
import { GameState } from './modules/GameState.js';
import { SudokuGenerator } from './modules/SudokuGenerator.js';
import { UIController } from './modules/UIController.js';
import { EventEmitter } from './modules/EventEmitter.js';
import { Timer } from './modules/Timer.js';

export class Game {
    constructor() {
        this.eventEmitter = new EventEmitter();
        this.uiController = new UIController(this.eventEmitter);
        this.board = new Board();
        this.solution = new Board();
        this.gameState = new GameState();
        this.generator = new SudokuGenerator();
        this.timer = new Timer(this.eventEmitter);
        this.selectedCell = null;
        
        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        // Yeni oyun butonu
        document.getElementById('newGame').addEventListener('click', () => {
            this.startNewGame();
        });

        // Zorluk seviyesi değişimi
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.gameState.difficulty = e.target.value;
            this.startNewGame();
        });

        // Çöz butonu
        document.getElementById('solve').addEventListener('click', () => {
            this.solveGame();
        });

        // Hücre seçimi
        document.getElementById('board').addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell) {
                this.handleCellSelection(cell);
            }
        });

        // Numara girişi
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('erase')) {
                    this.handleNumberInput({ isEraser: true });
                } else {
                    const number = parseInt(btn.dataset.number);
                    this.handleNumberInput({ number, isEraser: false });
                }
            });
        });

        // Klavye girişi
        document.addEventListener('keydown', (e) => {
            if (this.selectedCell) {
                if (e.key >= '1' && e.key <= '9') {
                    this.handleNumberInput({ number: parseInt(e.key), isEraser: false });
                } else if (e.key === 'Backspace' || e.key === 'Delete') {
                    this.handleNumberInput({ isEraser: true });
                }
            }
        });
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        boardElement.className = 'board-grid';

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                const value = this.board.getCell(row, col);
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('fixed');
                }

                boardElement.appendChild(cell);
            }
        }
    }

    startNewGame() {
        this.gameState.resetState();
        
        // Yeni çözüm oluştur
        const solutionArray = this.generator.generateSolution();
        this.solution = new Board();
        solutionArray.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                this.solution.setCell(rowIndex, colIndex, value);
            });
        });

        // Bulmacayı oluştur
        const puzzleArray = this.generator.createPuzzle(
            solutionArray,
            this.gameState.difficulty
        );
        this.board = new Board();
        puzzleArray.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                this.board.setCell(rowIndex, colIndex, value);
            });
        });
        
        // Timer'ı resetle ve başlat
        if (this.timer) {
            this.timer.reset();
            this.timer.start();
        }
        
        // Board'u yeniden render et
        this.renderBoard();
        
        // Hata sayacını resetle
        document.getElementById('mistakes').textContent = '0';
    }

    handleCellSelection(cell) {
        // Önceki seçili hücreyi temizle
        if (this.selectedCell) {
            this.selectedCell.classList.remove('selected');
            this.highlightRelatedCells(this.selectedCell, false);
        }

        // Yeni hücreyi seç
        if (cell && !cell.classList.contains('fixed')) {
            this.selectedCell = cell;
            this.selectedCell.classList.add('selected');
            this.highlightRelatedCells(cell, true);

            // Aynı sayıya sahip hücreleri vurgula
            const value = cell.textContent;
            if (value) {
                this.highlightSameNumbers(value, true);
            }
        } else {
            this.selectedCell = null;
        }
    }

    handleNumberInput(data) {
        if (!this.selectedCell || this.selectedCell.classList.contains('fixed') || 
            this.selectedCell.classList.contains('correct')) {
            return;
        }

        const row = parseInt(this.selectedCell.dataset.row);
        const col = parseInt(this.selectedCell.dataset.col);
        const number = data.number;
        const isEraser = data.isEraser;

        // Silme işlemi
        if (isEraser) {
            this.board.setCell(row, col, 0);
            this.selectedCell.textContent = '';
            this.selectedCell.classList.remove('error', 'correct');
            this.updateNumberButtons(); // Silme sonrası butonları güncelle
            return;
        }

        // Sayı girişi
        if (number >= 1 && number <= 9) {
            // Eğer sayı tüm pozisyonlarda kullanıldıysa girişe izin verme
            if (this.isNumberComplete(number)) {
                return;
            }

            const previousValue = this.selectedCell.textContent;
            this.board.setCell(row, col, number);
            this.selectedCell.textContent = number;

            // Doğruluk kontrolü
            if (this.solution.getCell(row, col) === number) {
                this.selectedCell.classList.remove('error');
                this.selectedCell.classList.add('correct');
                
                // Doğru hamle animasyonu
                this.selectedCell.classList.add('correct-animation');
                setTimeout(() => {
                    this.selectedCell.classList.remove('correct-animation');
                }, 500);

                // Sayı tamamlandı mı kontrolü
                if (this.isNumberComplete(number)) {
                    this.disableNumberButton(number);
                }
            } else {
                this.selectedCell.classList.add('error');
                this.selectedCell.classList.remove('correct');
                this.gameState.incrementMistakes();
                document.getElementById('mistakes').textContent = this.gameState.mistakes;

                // Yanlış hamle animasyonu
                this.selectedCell.classList.add('shake');
                setTimeout(() => {
                    this.selectedCell.classList.remove('shake');
                }, 500);
            }

            this.updateNumberButtons();

            // Kazanma kontrolü
            if (this.checkWin()) {
                this.gameWon();
            }
        }
    }

    isNumberComplete(number) {
        let count = 0;
        const totalRequired = 9; // Her sayıdan 9 adet olmalı

        // Board üzerindeki doğru yerleştirilmiş sayıları say
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board.getCell(row, col) === number && 
                    this.solution.getCell(row, col) === number) {
                    count++;
                }
            }
        }

        return count >= totalRequired;
    }

    updateNumberButtons() {
        // Her sayı için kontrol et
        for (let num = 1; num <= 9; num++) {
            if (this.isNumberComplete(num)) {
                this.disableNumberButton(num);
            } else {
                this.enableNumberButton(num);
            }
        }
    }

    disableNumberButton(number) {
        const button = document.querySelector(`.number-btn[data-number="${number}"]`);
        if (button) {
            button.classList.add('disabled');
            button.disabled = true;
        }
    }

    enableNumberButton(number) {
        const button = document.querySelector(`.number-btn[data-number="${number}"]`);
        if (button) {
            button.classList.remove('disabled');
            button.disabled = false;
        }
    }

    solveGame() {
        // Oyunu çöz
        const confirmation = window.confirm('Çözümü görmek istediğinizden emin misiniz?');
        
        if (confirmation) {
            this.timer.stop();
            
            // Animasyonlu çözüm
            const cells = document.querySelectorAll('.cell');
            let delay = 0;
            
            cells.forEach((cell) => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const correctValue = this.solution.getCell(row, col);
                
                if (cell.textContent !== correctValue.toString()) {
                    setTimeout(() => {
                        cell.textContent = correctValue;
                        cell.classList.add('solved');
                        
                        // Yanlış cevapları düzelt
                        cell.classList.remove('error');
                    }, delay);
                    delay += 50; // Her hücre için 50ms gecikme
                }
            });

            setTimeout(() => {
                this.gameState.isGameOver = true;
                this.showGameOverDialog('Oyun Çözüldü!', false);
            }, delay + 500);
        }
    }

    checkWin() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const currentValue = this.board.getCell(row, col);
                const correctValue = this.solution.getCell(row, col);
                
                if (currentValue !== correctValue) {
                    return false;
                }
            }
        }
        return true;
    }

    // Yardımcı metodlar
    highlightRelatedCells(cell, highlight) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);

        document.querySelectorAll('.cell').forEach((c) => {
            const cRow = parseInt(c.dataset.row);
            const cCol = parseInt(c.dataset.col);
            const cBox = Math.floor(cRow / 3) * 3 + Math.floor(cCol / 3);

            if (cRow === row || cCol === col || cBox === box) {
                c.classList.toggle('related', highlight);
            }
        });
    }

    highlightSameNumbers(number, highlight) {
        document.querySelectorAll('.cell').forEach((cell) => {
            if (cell.textContent === number.toString()) {
                cell.classList.toggle('same-number', highlight);
            }
        });
    }

    gameWon() {
        this.timer.stop();
        this.gameState.isGameOver = true;
        
        // Kazanma animasyonu
        document.querySelectorAll('.cell').forEach((cell) => {
            cell.classList.add('win');
        });

        // Kazanma mesajı
        setTimeout(() => {
            this.showGameOverDialog('Tebrikler! Sudoku\'yu Çözdünüz!', true);
        }, 1000);
    }

    showGameOverDialog(message, isWin) {
        // Overlay oluştur
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        document.body.appendChild(overlay);

        // Dialog oluştur
        const dialog = document.createElement('div');
        dialog.className = `game-over-dialog ${isWin ? 'win' : ''}`;
        
        // İstatistikler
        const timeSpent = document.getElementById('time').textContent;
        const mistakes = this.gameState.mistakes;
        const difficulty = this.gameState.difficulty;
        
        dialog.innerHTML = `
            <h2>${message}</h2>
            <div class="stats-container">
                <div class="stat-item">
                    <span class="stat-label">Süre</span>
                    <span class="stat-value">${timeSpent}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Hata</span>
                    <span class="stat-value">${mistakes}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Zorluk</span>
                    <span class="stat-value">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                </div>
            </div>
            <div class="dialog-buttons">
                <button class="dialog-btn dialog-btn-primary" id="newGameBtn">
                    <i class="fas fa-play"></i> Yeni Oyun
                </button>
                <button class="dialog-btn dialog-btn-secondary" id="closeDialogBtn">
                    <i class="fas fa-times"></i> Kapat
                </button>
            </div>
        `;

        document.body.appendChild(dialog);

        // Kazanma durumunda konfeti efekti
        if (isWin) {
            this.createConfetti();
        }

        // Event Listeners
        document.getElementById('newGameBtn').addEventListener('click', () => {
            dialog.remove();
            overlay.remove();
            this.startNewGame();
        });

        document.getElementById('closeDialogBtn').addEventListener('click', () => {
            dialog.remove();
            overlay.remove();
        });
    }

    createConfetti() {
        const colors = [
            '#6366f1', // primary
            '#8b5cf6', // secondary
            '#ec4899', // accent
            '#22c55e', // success
        ];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animation = `confetti ${1 + Math.random() * 2}s ease forwards`;
            confetti.style.animationDelay = Math.random() * 3 + 's';
            
            document.body.appendChild(confetti);
            
            // Animasyon bitince elementi kaldır
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }
} 