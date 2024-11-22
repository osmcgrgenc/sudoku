// UIController sınıfı - Arayüz Yönetimi
export class UIController {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.selectedCell = null;
    }

    renderBoard(board) {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = this.createCell(i, j, board.getCell(i, j));
                boardElement.appendChild(cell);
            }
        }
    }

    createCell(row, col, value) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        if (value !== 0) {
            cell.textContent = value;
            cell.classList.add('fixed');
        }

        this.applyCellStyles(cell, row, col);
        return cell;
    }

    applyCellStyles(cell, row, col) {
        if ((row + 1) % 3 === 0 && row !== 8) {
            cell.style.borderBottom = '2px solid #1f2937';
        }
        if ((col + 1) % 3 === 0 && col !== 8) {
            cell.style.borderRight = '2px solid #1f2937';
        }
    }

    updateTimer(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById('time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateMistakes(mistakes) {
        document.getElementById('mistakes').textContent = mistakes;
    }
} 