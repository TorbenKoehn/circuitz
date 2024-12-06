export default class Connection {
    #source;
    #target;
    #signalDuration;
    #lastSignalTime = -Infinity;
    #lineStyle;
    #distance = 0;
    constructor(init) {
        this.#source = init.source;
        this.#target = init.target;
        this.#signalDuration = init.signalDuration ?? 1000;
        this.#lineStyle = init.lineStyle ?? 'auto';
        this.recalculateDistance();
    }
    get source() {
        return this.#source;
    }
    get target() {
        return this.#target;
    }
    get signalFrequency() {
        return this.#signalDuration;
    }
    get lineStyle() {
        return this.#lineStyle;
    }
    get distance() {
        return this.#distance;
    }
    draw(args) {
        const context = args.context;
        const sourcePortBounds = this.#source.absolutePixelBounds;
        const sourceCircuit = this.#source.circuit;
        const targetPortBounds = this.#target.absolutePixelBounds;
        const targetCircuit = this.#target.circuit;
        if (!sourceCircuit || !targetCircuit) {
            return;
        }
        const sourceX = sourcePortBounds.x + sourceCircuit.gridSize / 2;
        const sourceY = sourcePortBounds.y + sourceCircuit.gridSize / 2;
        const targetX = targetPortBounds.x + targetCircuit.gridSize / 2;
        const targetY = targetPortBounds.y + targetCircuit.gridSize / 2;
        // Draw a small red dot on both ends to signify "connected"
        context.fillStyle = '#333';
        context.beginPath();
        context.arc(sourceX, sourceY, 3, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
        context.arc(targetX, targetY, 3, 0, 2 * Math.PI);
        context.fill();
        const active = !this.#source.isClear();
        const now = performance.now();
        context.strokeStyle = active ? '#afa' : '#ccc';
        const sourceIsOnRightSideOfCircuit = sourcePortBounds.x > sourceCircuit.absolutePixelBounds.width / 2;
        const preferVertical = !sourceIsOnRightSideOfCircuit;
        const lineStyle = (() => {
            if (this.#lineStyle === 'auto') {
                if (sourceX === targetX || sourceY === targetY) {
                    return 'diagonal';
                }
                return preferVertical ? 'vertical' : 'horizontal';
            }
            return this.#lineStyle;
        })();
        context.setLineDash([0, 0]);
        if (lineStyle === 'diagonal') {
            // Draw straight connection
            context.beginPath();
            context.moveTo(sourceX, sourceY);
            context.lineTo(targetX, targetY);
            context.stroke();
        }
        else if (lineStyle === 'vertical') {
            // Draw L-shaped connection: vertical first, then horizontal
            context.beginPath();
            context.moveTo(sourceX, sourceY);
            context.lineTo(sourceX, targetY); // Vertical line
            context.lineTo(targetX, targetY); // Horizontal line
            context.stroke();
        }
        else {
            // Draw L-shaped connection: horizontal first, then vertical
            context.beginPath();
            context.moveTo(sourceX, sourceY);
            context.lineTo(targetX, sourceY); // Horizontal line
            context.lineTo(targetX, targetY); // Vertical line
            context.stroke();
        }
        context.fillStyle = '#040';
        const elapsedSignalTime = now - this.#lastSignalTime;
        if (active) {
            const progress = elapsedSignalTime / this.#signalDuration;
            if (progress >= 1) {
                this.#lastSignalTime = now;
            }
            const dashPosition = -progress * this.#distance;
            context.setLineDash([10, 10]);
            context.lineDashOffset = dashPosition;
            context.stroke();
        }
        else {
            this.#lastSignalTime = -Infinity;
        }
    }
    recalculateDistance() {
        const sourcePixelBounds = this.#source?.absolutePixelBounds;
        const targetPixelBounds = this.#target?.absolutePixelBounds;
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
