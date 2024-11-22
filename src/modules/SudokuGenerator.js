export class SudokuGenerator {
    constructor() {
        this.GRID_SIZE = 9;
        this.BOX_SIZE = 3;
        this.EMPTY_CELL = 0;
    }

    generateSolution() {
        const grid = Array(this.GRID_SIZE).fill()
            .map(() => Array(this.GRID_SIZE).fill(this.EMPTY_CELL));

        if (this.solveSudoku(grid)) {
            return grid;
        }
        return null;
    }

    createPuzzle(solutionGrid, difficulty) {
        // Zorluk seviyelerine göre boş hücre sayısı
        const cellsToRemove = {
            easy: 30,
            medium: 40,
            hard: 50
        };

        // Çözümü kopyala
        const puzzle = solutionGrid.map(row => [...row]);
        const positions = this.getRandomPositions();
        
        // Belirlenen zorluk seviyesine göre hücreleri boşalt
        for (let i = 0; i < cellsToRemove[difficulty]; i++) {
            const [row, col] = positions[i];
            puzzle[row][col] = this.EMPTY_CELL;
        }

        return puzzle;
    }

    solveSudoku(grid) {
        const emptyCell = this.findEmptyCell(grid);
        
        if (!emptyCell) return true; // Tüm hücreler dolu
        
        const [row, col] = emptyCell;
        const numbers = this.getShuffledNumbers();

        for (const num of numbers) {
            if (this.isValid(grid, row, col, num)) {
                grid[row][col] = num;

                if (this.solveSudoku(grid)) {
                    return true;
                }

                grid[row][col] = this.EMPTY_CELL; // Backtrack
            }
        }

        return false;
    }

    isValid(grid, row, col, num) {
        // Satır kontrolü
        for (let x = 0; x < this.GRID_SIZE; x++) {
            if (grid[row][x] === num) return false;
        }

        // Sütun kontrolü
        for (let y = 0; y < this.GRID_SIZE; y++) {
            if (grid[y][col] === num) return false;
        }

        // 3x3 kutu kontrolü
        const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
        const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;

        for (let i = 0; i < this.BOX_SIZE; i++) {
            for (let j = 0; j < this.BOX_SIZE; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }

        return true;
    }

    findEmptyCell(grid) {
        for (let row = 0; row < this.GRID_SIZE; row++) {
            for (let col = 0; col < this.GRID_SIZE; col++) {
                if (grid[row][col] === this.EMPTY_CELL) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    getShuffledNumbers() {
        const numbers = Array.from({length: this.GRID_SIZE}, (_, i) => i + 1);
        // Fisher-Yates shuffle algoritması
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        return numbers;
    }

    getRandomPositions() {
        const positions = [];
        for (let row = 0; row < this.GRID_SIZE; row++) {
            for (let col = 0; col < this.GRID_SIZE; col++) {
                positions.push([row, col]);
            }
        }
        // Pozisyonları karıştır
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        return positions;
    }

    // Sudoku'nun geçerli olup olmadığını kontrol et
    validateSudoku(grid) {
        for (let row = 0; row < this.GRID_SIZE; row++) {
            for (let col = 0; col < this.GRID_SIZE; col++) {
                const currentNum = grid[row][col];
                if (currentNum !== this.EMPTY_CELL) {
                    grid[row][col] = this.EMPTY_CELL;
                    if (!this.isValid(grid, row, col, currentNum)) {
                        return false;
                    }
                    grid[row][col] = currentNum;
                }
            }
        }
        return true;
    }

    // Sudoku'nun tek çözümü olduğunu kontrol et
    hasUniqueSolution(grid) {
        let solutions = 0;
        const checkSolutions = (testGrid) => {
            if (solutions > 1) return;

            const emptyCell = this.findEmptyCell(testGrid);
            if (!emptyCell) {
                solutions++;
                return;
            }

            const [row, col] = emptyCell;
            for (let num = 1; num <= this.GRID_SIZE; num++) {
                if (this.isValid(testGrid, row, col, num)) {
                    testGrid[row][col] = num;
                    checkSolutions(testGrid);
                    testGrid[row][col] = this.EMPTY_CELL;
                }
            }
        };

        const testGrid = grid.map(row => [...row]);
        checkSolutions(testGrid);
        return solutions === 1;
    }
} 