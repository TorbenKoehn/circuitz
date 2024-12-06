import Connection from './Connection.js';
export default class Port {
    #circuit = undefined;
    #position;
    #absoluteBounds = new DOMRect(0, 0, 0, 0);
    #absolutePixelBounds = new DOMRect(0, 0, 0, 0);
    #clearValue;
    #value;
    #outboundConnections = new Map();
    #inboundConnections = new Map();
    #lastReadTime = -Infinity;
    #lastWriteTime = -Infinity;
    constructor(init) {
        this.#position = init.position;
        this.#clearValue = init.clearValue;
        this.#value = init.clearValue;
        this.#outboundConnections = new Map();
    }
    get circuit() {
        return this.#circuit;
    }
    get position() {
        return this.#position;
    }
    get absoluteBounds() {
        return this.#absoluteBounds;
    }
    get absolutePixelBounds() {
        return this.#absolutePixelBounds;
    }
    get clearValue() {
        return this.#clearValue;
    }
    get value() {
        return this.#value;
    }
    get connections() {
        return this.#outboundConnections;
    }
    get lastReadElapsedTime() {
        return performance.now() - this.#lastReadTime;
    }
    get lastWriteElapsedTime() {
        return performance.now() - this.#lastWriteTime;
    }
    setCircuit(circuit) {
        if (circuit && this.#circuit && this.#circuit !== circuit) {
            this.#circuit.removePort(this);
        }
        if (!circuit && this.#circuit && this.#circuit.hasPort(this)) {
            this.#circuit.removePort(this);
        }
        if (this.#circuit !== circuit) {
            this.#circuit = circuit;
        }
        if (circuit && !circuit.hasPort(this)) {
            circuit.addPort(this);
        }
    }
    isConnected(targetPort) {
        return this.#outboundConnections.has(targetPort);
    }
    connect(targetPort, init) {
        if (this.isConnected(targetPort)) {
            return;
        }
        const connection = new Connection({
            source: this,
            target: targetPort,
            ...init,
        });
        this.#outboundConnections.set(targetPort, connection);
        targetPort.#inboundConnections.set(this, connection);
    }
    link(targetPort) {
        this.connect(targetPort);
        targetPort.connect(this);
    }
    disconnect(targetPort) {
        this.#outboundConnections.delete(targetPort);
        targetPort.#inboundConnections.delete(this);
    }
    isClear() {
        return this.#value === this.#clearValue;
    }
    clear() {
        this.#value = this.#clearValue;
    }
    read() {
        return this.#value;
    }
    write(value) {
        this.#value = value;
        this.#lastWriteTime = performance.now();
    }
    update() {
        // Read the first inbound connection port value that is not clear
        for (const port of this.#inboundConnections.keys()) {
            if (port.isClear()) {
                continue;
            }
            // Successful signal. Copy it to our value.
            this.#lastReadTime = performance.now();
            this.#value = port.value;
            return;
        }
        // No one is giving us a signal, despite us being connected to stuff. Clear our current value, as it's stale
        this.clear();
    }
    draw(args) {
        const context = args.context;
        const bounds = this.#absolutePixelBounds;
        context.fillStyle = this.#getFillColor();
        // Draw a circle in bounds
        context.beginPath();
        context.arc(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, bounds.width / 2, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.font = '10px monospace';
        context.fillText(this.#getValueText(), bounds.x + 15, bounds.y + 10);
    }
    recalculateBounds() {
        const circuitBounds = this.#circuit?.absoluteBounds;
        this.#absoluteBounds.x = circuitBounds
            ? circuitBounds.x + this.#position.x
            : this.#position.x;
        this.#absoluteBounds.y = circuitBounds
            ? circuitBounds.y + this.#position.y
            : this.#position.y;
        this.#absoluteBounds.width = 1;
        this.#absoluteBounds.height = 1;
    }
    recalculatePixelBounds() {
        const bounds = this.#absoluteBounds;
        const gridSize = this.#circuit?.gridSize ?? 0;
        this.#absolutePixelBounds.x = bounds.x * gridSize;
        this.#absolutePixelBounds.y = bounds.y * gridSize;
        this.#absolutePixelBounds.width = bounds.width * gridSize;
        this.#absolutePixelBounds.height = bounds.height * gridSize;
        // Also recalculate connections
        this.#outboundConnections.forEach((connection) => connection.recalculateDistance());
    }
    #getFillColor() {
        const lastWriteElapsedTime = this.lastWriteElapsedTime;
        const lastReadElapsedTime = this.lastReadElapsedTime;
        if (lastWriteElapsedTime < 100) {
            const greenRate = 200 + 55 - (55 * lastWriteElapsedTime) / 100;
            return `rgb(100, ${greenRate.toFixed(2)}, 100)`;
        }
        if (lastReadElapsedTime < 100) {
            const blueRate = 200 + 55 - (55 * lastReadElapsedTime) / 100;
            return `rgb(100, 100, ${blueRate.toFixed(2)})`;
        }
        return '#888';
    }
    #getValueText() {
        return String(this.#value);
    }
}
