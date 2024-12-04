import Signal from './Signal.js';
export default class PortConnection {
    source;
    target;
    signals = [];
    transmissionSpeed;
    #distance = 0;
    constructor(source, target, transmissionSpeed = 0.4) {
        this.source = source;
        this.target = target;
        this.transmissionSpeed = transmissionSpeed;
        this.recalculateDistance();
    }
    get distance() {
        return this.#distance;
    }
    getSignalProgress(signal) {
        const elapsedTime = performance.now() - signal.startTime;
        return Math.min(1, elapsedTime / (this.distance / this.transmissionSpeed));
    }
    hasSignalArrived(signal) {
        return this.getSignalProgress(signal) >= 1;
    }
    dispatch(state) {
        this.signals.push(new Signal(state, performance.now()));
    }
    tick() {
        const arrivedSignals = this.signals.filter((signal) => this.hasSignalArrived(signal));
        // Remove arrived signals from the queue
        const indexes = arrivedSignals.map((signal) => this.signals.indexOf(signal));
        indexes.forEach((index) => this.signals.splice(index, 1));
        arrivedSignals.forEach((signal) => {
            this.target.receive(signal.value);
        });
    }
    recalculateDistance() {
        const sourcePixelBounds = this.source?.absolutePixelBounds;
        const targetPixelBounds = this.target?.absolutePixelBounds;
        if (!sourcePixelBounds || !targetPixelBounds) {
            this.#distance = 0;
        }
        const sourceCenterX = sourcePixelBounds.x + sourcePixelBounds.width / 2;
        const sourceCenterY = sourcePixelBounds.y + sourcePixelBounds.height / 2;
        const targetCenterX = targetPixelBounds.x + targetPixelBounds.width / 2;
        const targetCenterY = targetPixelBounds.y + targetPixelBounds.height / 2;
        // Distance is L-shaped, not diagonal
        this.#distance =
            Math.abs(sourceCenterX - targetCenterX) +
                Math.abs(sourceCenterY - targetCenterY);
    }
}
