export default class Circuit {
    #parent = undefined;
    #bounds;
    #absoluteBounds = new DOMRect(0, 0, 0, 0);
    #absolutePixelBounds = new DOMRect(0, 0, 0, 0);
    #gridSize;
    #backgroundColor;
    #ports = new Set();
    #children = new Set();
    constructor(init) {
        this.#bounds = init.bounds;
        this.#gridSize = init.gridSize ?? 32;
        this.#backgroundColor = init.backgroundColor ?? '#333';
        this.recalculateBounds();
        this.recalculatePixelBounds();
    }
    get parent() {
        return this.#parent;
    }
    get bounds() {
        return this.#bounds;
    }
    get gridSize() {
        return this.#gridSize;
    }
    get absoluteBounds() {
        return this.#absoluteBounds;
    }
    get absolutePixelBounds() {
        return this.#absolutePixelBounds;
    }
    get ports() {
        return this.#ports;
    }
    get children() {
        return this.#children;
    }
    hasPort(port) {
        return this.#ports.has(port);
    }
    addPort(port) {
        this.#ports.add(port);
        port.setCircuit(this);
        port.recalculateBounds();
        port.recalculatePixelBounds();
    }
    addPorts(ports) {
        for (const port of ports) {
            this.addPort(port);
        }
    }
    removePort(port) {
        this.#ports.delete(port);
        port.setCircuit(undefined);
    }
    removePorts(ports) {
        for (const port of ports) {
            this.removePort(port);
        }
    }
    clearPorts() {
        Object.values(this.#ports).forEach((port) => port.clear());
    }
    hasChild(child) {
        return this.#children.has(child);
    }
    addChild(child) {
        this.#children.add(child);
        child.#parent = this;
        child.recalculateBounds();
        child.recalculatePixelBounds();
    }
    addChildren(children) {
        for (const child of children) {
            this.addChild(child);
        }
    }
    removeChild(child) {
        this.#children.delete(child);
        child.#parent = undefined;
    }
    removeChildren(children) {
        for (const child of children) {
            this.removeChild(child);
        }
    }
    updateChildren() {
        this.#children.forEach((child) => child.update());
    }
    tickChildren() {
        this.#children.forEach((child) => child.tick());
    }
    updatePorts() {
        this.#ports.forEach((port) => port.update());
    }
    update() {
        this.updateChildren();
        this.updatePorts();
    }
    tick() {
        this.tickChildren();
    }
    setAllGridSizes(gridSize) {
        this.#gridSize = gridSize;
        this.#children.forEach((child) => child.setAllGridSizes(gridSize));
        this.recalculateBounds();
        this.recalculatePixelBounds();
    }
    drawBackground(args) {
        const context = args.context;
        context.fillStyle = this.#backgroundColor;
        context.fillRect(this.#absolutePixelBounds.x, this.#absolutePixelBounds.y, this.#absolutePixelBounds.width, this.#absolutePixelBounds.height);
    }
    drawPorts(args) {
        this.#ports.forEach((port) => port.draw(args));
    }
    drawConnections(args) {
        this.#ports.forEach((port) => port.connections.forEach((connection) => connection.draw(args)));
    }
    drawChildren(args) {
        this.#children.forEach((child) => child.draw(args));
    }
    drawChildConnections(args) {
        this.#children.forEach((child) => child.drawConnections(args));
    }
    draw(args) {
        this.drawBackground(args);
        this.drawChildren(args);
        this.drawPorts(args);
        this.drawChildConnections(args);
        // Only if the are the last parent, draw our own port connections. Otherwise our parent will draw it.
        if (!this.#parent) {
            this.drawConnections(args);
        }
    }
    recalculateBounds() {
        const parentBounds = this.#parent?.absoluteBounds;
        this.#absoluteBounds.x = parentBounds
            ? parentBounds.x + this.#bounds.x
            : this.#bounds.x;
        this.#absoluteBounds.y = parentBounds
            ? parentBounds.y + this.#bounds.y
            : this.#bounds.y;
        this.#absoluteBounds.width = this.#bounds.width;
        this.#absoluteBounds.height = this.#bounds.height;
        // Also recalculate child and port bounds
        this.#children.forEach((child) => child.recalculateBounds());
        this.#ports.forEach((port) => port.recalculateBounds());
    }
    recalculatePixelBounds() {
        const bounds = this.#absoluteBounds;
        this.#absolutePixelBounds.x = bounds.x * this.#gridSize;
        this.#absolutePixelBounds.y = bounds.y * this.#gridSize;
        this.#absolutePixelBounds.width = bounds.width * this.#gridSize;
        this.#absolutePixelBounds.height = bounds.height * this.#gridSize;
        // Also recalculate child and port pixel bounds
        this.#children.forEach((child) => child.recalculatePixelBounds());
        this.#ports.forEach((port) => port.recalculatePixelBounds());
    }
}
