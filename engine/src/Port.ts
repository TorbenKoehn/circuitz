import Circuit from './Circuit.js'
import PortConnection from './PortConnection.js'
import { DrawArgs } from './utils.js'

export type PortAccess = 'read' | 'write' | 'receive' | 'send'

export type PortInit = {
  position: DOMPoint
  lifeTime?: number
  bufferSize?: number
  access?: PortAccess[]
}

export type BufferItem<Value> = {
  readonly receiveTime: number
  readonly value: Value
}

export default class Port<Value> {
  #circuit: Circuit | undefined = undefined
  #position: DOMPoint

  #absoluteBounds: DOMRect = new DOMRect(0, 0, 0, 0)
  #absolutePixelBounds: DOMRect = new DOMRect(0, 0, 0, 0)

  #access: PortAccess[]

  #lifeTime: number
  #bufferSize: number
  #buffer: BufferItem<Value>[]

  #connections: PortConnection<Value>[] = []

  #lastReadTime: number = -Infinity
  #lastReadValue: Value | undefined = undefined
  #lastWriteTime: number = -Infinity
  #lastWriteValue: Value | undefined = undefined
  #lastSendTime: number = -Infinity
  #lastSendValue: Value | undefined = undefined
  #lastReceiveTime: number = -Infinity
  #lastReceiveValue: Value | undefined = undefined

  constructor(init: PortInit) {
    this.#position = init.position

    this.#access = init.access ?? []

    this.#lifeTime = init.lifeTime ?? Infinity
    this.#bufferSize = init.bufferSize ?? 1
    this.#buffer = []

    this.#connections = []
  }

  get circuit(): Circuit | undefined {
    return this.#circuit
  }

  set circuit(value: Circuit | undefined) {
    if (value && this.#circuit && this.#circuit !== value) {
      this.#circuit.removePort(this)
    }

    if (!value && this.#circuit && this.#circuit.hasPort(this)) {
      this.#circuit.removePort(this)
    }

    if (this.#circuit !== value) {
      this.#circuit = value
    }

    if (value && !value.hasPort(this)) {
      value.addPort(this)
    }
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

  get access(): PortAccess[] {
    return this.#access
  }

  get lifeTime(): number {
    return this.#lifeTime
  }

  get bufferSize(): number {
    return this.#bufferSize
  }

  get buffer(): ReadonlyArray<BufferItem<Value>> {
    return this.#buffer
  }

  get connections(): ReadonlyArray<PortConnection<Value>> {
    return this.#connections
  }

  get canRead() {
    return this.#access.includes('read')
  }

  get canWrite() {
    return this.#access.includes('write')
  }

  get canReceive() {
    return this.#access.includes('receive')
  }

  get canSend() {
    return this.#access.includes('send')
  }

  get dataAvailable() {
    return this.#buffer.length > 0
  }

  get lastReadElapsedTime() {
    return performance.now() - this.#lastReadTime
  }

  get lastWriteElapsedTime() {
    return performance.now() - this.#lastWriteTime
  }

  get lastSendElapsedTime() {
    return performance.now() - this.#lastSendTime
  }

  get lastReceiveElapsedTime() {
    return performance.now() - this.#lastReceiveTime
  }

  isConnected(targetPort: Port<Value>) {
    return this.#connections.some(
      (connection) => connection.target === targetPort
    )
  }

  connect(targetPort: Port<Value>) {
    if (this.isConnected(targetPort)) {
      return
    }

    this.#connections.push(new PortConnection(this, targetPort))
  }

  link(targetPort: Port<Value>) {
    this.connect(targetPort)
    targetPort.connect(this)
  }

  disconnect(targetPort: Port<Value>) {
    const index = this.#connections.findIndex(
      (connection) => connection.target === targetPort
    )

    if (index === -1) {
      return
    }

    this.#connections.splice(index, 1)
  }

  read(): Value {
    if (!this.canRead) {
      throw new Error(`Port is not readable.`)
    }

    if (!this.dataAvailable) {
      throw new Error('No data available')
    }

    const item = this.#buffer.shift()
    if (item === undefined) {
      throw new Error('No data available')
    }

    this.#lastReadTime = performance.now()
    this.#lastReadValue = item.value

    return item.value
  }

  readAll(): Value[] {
    if (!this.canRead) {
      throw new Error(`Port is not readable.`)
    }

    if (!this.dataAvailable) {
      throw new Error('No data available')
    }

    const states = this.#buffer
    this.#buffer = []

    this.#lastReadTime = performance.now()
    this.#lastReadValue = states[states.length - 1].value

    return states.map((item) => item.value)
  }

  write(value: Value) {
    if (!this.canWrite) {
      throw new Error(`Port is not writable.`)
    }

    if (this.#buffer.length >= this.#bufferSize) {
      this.#buffer.shift()
    }

    const receiveTime = performance.now()
    this.#buffer.push({ receiveTime, value })

    this.#lastWriteTime = receiveTime
    this.#lastWriteValue = value
  }

  receive(value: Value): void {
    if (!this.canReceive) {
      throw new Error(`Port can't receive data.`)
    }

    if (this.#buffer.length >= this.#bufferSize) {
      this.#buffer.shift()
    }

    const receiveTime = performance.now()
    this.#buffer.push({ receiveTime, value })

    this.#lastReceiveTime = receiveTime
    this.#lastReceiveValue = value

    if (this.canSend) {
      this.send(value)
    }
  }

  send(value: Value) {
    if (!this.canSend) {
      throw new Error(`Port can't send data.`)
    }

    this.#connections.forEach((connection) => {
      if (!connection.target.canReceive) {
        return
      }
      connection.dispatch(value)
    })

    this.#lastSendTime = performance.now()
    this.#lastSendValue = value
  }

  tick(): void {
    this.#connections.forEach((connection) => connection.tick())

    // Drop values that have been in the buffer for too long
    const currentTime = performance.now()
    this.#buffer = this.#buffer.filter(
      (item) => currentTime - item.receiveTime < this.#lifeTime
    )
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
    this.#connections.forEach((connection) => connection.recalculateDistance())
  }

  #getFillColor(): string {
    if (this.lastSendElapsedTime < 100) {
      const greenRate = 200 + 55 - (55 * this.lastSendElapsedTime) / 100
      return `rgb(100, ${greenRate.toFixed(2)}, 100)`
    }

    if (this.lastReceiveElapsedTime < 100) {
      const blueRate = 200 + 55 - (55 * this.lastReceiveElapsedTime) / 100
      return `rgb(100, 100, ${blueRate.toFixed(2)})`
    }

    return '#888'
  }

  #getValueText(): string {
    if (this.#lastSendTime > 0 && this.#lastSendTime < 100) {
      return String(this.#lastSendValue)
    }

    if (this.#lastReceiveTime > 0 && this.#lastReceiveTime < 100) {
      return String(this.#lastReceiveValue)
    }

    if (this.#buffer.length > 0) {
      return String(this.#buffer[this.#buffer.length - 1].value)
    }

    return ''
  }
}
