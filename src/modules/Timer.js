// Timer sınıfı - Tek Sorumluluk Prensibi (SRP)
export class Timer {
    constructor(eventEmitter) {
        this.time = 0;
        this.interval = null;
        this.eventEmitter = eventEmitter;
    }

    start() {
        this.interval = setInterval(() => {
            this.time++;
            this.eventEmitter.emit('timerUpdate', this.time);
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

    reset() {
        this.time = 0;
        this.stop();
    }
} 