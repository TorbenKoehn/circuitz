import Circuit from './Circuit.js'
import Connection, {
  ConnectionInit,
  ConnectionLineStyle,
} from './Connection.js'
import { DrawArgs } from './utils.js'

export type PortInit<Value> = {
  readonly position: DOMPoint
  readonly clearValue: Value
  readonly lifeTime?: number
}

export default class Port<Value> {
  #circuit: Circuit | undefined = undefined
  #position: DOMPoint

  #absoluteBounds: DOMRect = new DOMRect(0, 0, 0, 0)
  #absolutePixelBounds: DOMRect = new DOMRect(0, 0, 0, 0)

  #clearValue: Value
  #value: Value

  #outboundConnections: Map<Port<Value>, Connection<Value>> = new Map()
  #inboundConnections: Map<Port<Value>, Connection<Value>> = new Map()

  #lastReadTime: number = -Infinity
  #lastWriteTime: number = -Infinity

  constructor(init: PortInit<Value>) {
    this.#position = init.position
    this.#clearValue = init.clearValue
    this.#value = init.clearValue
    this.#outboundConnections = new Map()
  }

  get circuit(): Circuit | undefined {
    return this.#circuit
  }

  get position(): DOMPoint {
    return this.#position
  }

  get absoluteBounds(): DOMRect {
    return this.#absoluteBounds
  }

  get absolutePixelBounds(): DOMRect {
    return this.#absolutePixelBounds
  }

  get clearValue(): Value {
    return this.#clearValue
  }

  get value(): Value {
    return this.#value
  }

  get connections(): ReadonlyMap<Port<Value>, Connection<Value>> {
    return this.#outboundConnections
  }

  get lastReadElapsedTime() {
    return performance.now() - this.#lastReadTime
  }

  get lastWriteElapsedTime() {
    return performance.now() - this.#lastWriteTime
  }

  setCircuit(circuit: Circuit | undefined) {
    if (circuit && this.#circuit && this.#circuit !== circuit) {
      this.#circuit.removePort(this)
    }

    if (!circuit && this.#circuit && this.#circuit.hasPort(this)) {
      this.#circuit.removePort(this)
    }

    if (this.#circuit !== circuit) {
      this.#circuit = circuit
    }

    if (circuit && !circuit.hasPort(this)) {
      circuit.addPort(this)
    }
  }

  isConnected(targetPort: Port<Value>) {
    return this.#outboundConnections.has(targetPort)
  }

  connect(
    targetPort: Port<Value>,
    init?: Omit<ConnectionInit<Value>, 'source' | 'target'>
  ) {
    if (this.isConnected(targetPort)) {
      return
    }

    const connection = new Connection({
      source: this,
      target: targetPort,
      ...init,
    })
    this.#outboundConnections.set(targetPort, connection)
    targetPort.#inboundConnections.set(this, connection)
  }

  link(targetPort: Port<Value>) {
    this.connect(targetPort)
    targetPort.connect(this)
  }

  disconnect(targetPort: Port<Value>) {
    this.#outboundConnections.delete(targetPort)
    targetPort.#inboundConnections.delete(this)
  }

  isClear(): boolean {
    return this.#value === this.#clearValue
  }

  clear(): void {
    this.#value = this.#clearValue
  }

  read(): Value {
    return this.#value
  }

  write(value: Value) {
    this.#value = value

    this.#lastWriteTime = performance.now()
  }

  update(): void {
    // Read the first inbound connection port value that is not clear
    for (const port of this.#inboundConnections.keys()) {
      if (port.isClear()) {
        continue
      }

      // Successful signal. Copy it to our value.
      this.#lastReadTime = performance.now()
      this.#value = port.value
      return
    }

    // No one is giving us a signal, despite us being connected to stuff. Clear our current value, as it's stale
    this.clear()
  }

  draw(args: DrawArgs) {
    const context = args.context
    const bounds = this.#absolutePixelBounds

    context.fillStyle = this.#getFillColor()
    // Draw a circle in bounds
    context.beginPath()
    context.arc(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
      bounds.width / 2,
      0,
      2 * Math.PI
    )
    context.fill()
    context.fillStyle = 'black'
    context.textAlign = 'center'
    context.font = '10px monospace'
    context.fillText(this.#getValueText(), bounds.x + 15, bounds.y + 10)
  }

  recalculateBounds(): void {
    const circuitBounds = this.#circuit?.absoluteBounds
    this.#absoluteBounds.x = circuitBounds
      ? circuitBounds.x + this.#position.x
      : this.#position.x
    this.#absoluteBounds.y = circuitBounds
      ? circuitBounds.y + this.#position.y
      : this.#position.y
    this.#absoluteBounds.width = 1
    this.#absoluteBounds.height = 1
  }

  recalculatePixelBounds(): void {
    const bounds = this.#absoluteBounds
    const gridSize = this.#circuit?.gridSize ?? 0
    this.#absolutePixelBounds.x = bounds.x * gridSize
    this.#absolutePixelBounds.y = bounds.y * gridSize
    this.#absolutePixelBounds.width = bounds.width * gridSize
    this.#absolutePixelBounds.height = bounds.height * gridSize

    // Also recalculate connections
    this.#outboundConnections.forEach((connection) =>
      connection.recalculateDistance()
    )
  }

  #getFillColor(): string {
    const lastWriteElapsedTime = this.lastWriteElapsedTime
    const lastReadElapsedTime = this.lastReadElapsedTime

    if (lastWriteElapsedTime < 100) {
      const greenRate = 200 + 55 - (55 * lastWriteElapsedTime) / 100
      return `rgb(100, ${greenRate.toFixed(2)}, 100)`
    }

    if (lastReadElapsedTime < 100) {
      const blueRate = 200 + 55 - (55 * lastReadElapsedTime) / 100
      return `rgb(100, 100, ${blueRate.toFixed(2)})`
    }

    return '#888'
  }

  #getValueText(): string {
    return String(this.#value)
  }
}
