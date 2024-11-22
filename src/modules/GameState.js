export class GameState {
    constructor() {
        this.mistakes = 0;
        this.timer = 0;
        this.isGameOver = false;
        this.difficulty = 'medium';
    }

    incrementMistakes() {
        this.mistakes++;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    resetState() {
        this.mistakes = 0;
        this.timer = 0;
        this.isGameOver = false;
    }
} 