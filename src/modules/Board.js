export class Board {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
    }

    setCell(row, col, value) {
        if (this.isValidPosition(row, col) && this.isValidValue(value)) {
            this.grid[row][col] = value;
            return true;
        }
        return false;
    }

    getCell(row, col) {
        return this.isValidPosition(row, col) ? this.grid[row][col] : null;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 9 && col >= 0 && col < 9;
    }

    isValidValue(value) {
        return value >= 0 && value <= 9;
    }

    getGrid() {
        return this.grid;
    }

    setGrid(newGrid) {
        if (Array.isArray(newGrid) && 
            newGrid.length === 9 && 
            newGrid.every(row => Array.isArray(row) && row.length === 9)) {
            this.grid = newGrid.map(row => [...row]);
            return true;
        }
        return false;
    }

    clone() {
        const newBoard = new Board();
        newBoard.setGrid(this.grid);
        return newBoard;
    }

    toString() {
        return this.grid.map(row => row.join(' ')).join('\n');
    }
} 