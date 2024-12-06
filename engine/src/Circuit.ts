import Port from './Port.js'
import { DrawArgs } from './utils.js'

export type CircuitInit = {
  bounds: DOMRect
  gridSize?: number
  backgroundColor?: string
}

type PortSet = Set<Port<unknown>>
type CircuitSet = Set<Circuit>

export default abstract class Circuit {
  #parent: Circuit | undefined = undefined
  #bounds: DOMRect
  #absoluteBounds: DOMRect = new DOMRect(0, 0, 0, 0)
  #absolutePixelBounds: DOMRect = new DOMRect(0, 0, 0, 0)
  #gridSize: number
  #backgroundColor: string

  #ports: PortSet = new Set()
  #children: CircuitSet = new Set()

  constructor(init: CircuitInit) {
    this.#bounds = init.bounds
    this.#gridSize = init.gridSize ?? 32
    this.#backgroundColor = init.backgroundColor ?? '#333'

    this.recalculateBounds()
    this.recalculatePixelBounds()
  }

  get parent(): Circuit | undefined {
    return this.#parent
  }

  get bounds(): Readonly<DOMRect> {
    return this.#bounds
  }

  get gridSize(): number {
    return this.#gridSize
  }

  get absoluteBounds(): Readonly<DOMRect> {
    return this.#absoluteBounds
  }

  get absolutePixelBounds(): Readonly<DOMRect> {
    return this.#absolutePixelBounds
  }

  get ports(): ReadonlySet<Port<unknown>> {
    return this.#ports
  }

  get children(): ReadonlySet<Circuit> {
    return this.#children
  }

  hasPort(port: Port<unknown>): boolean {
    return this.#ports.has(port)
  }

  addPort<State>(port: Port<State>): void {
    this.#ports.add(port)
    port.setCircuit(this)
    port.recalculateBounds()
    port.recalculatePixelBounds()
  }

  addPorts(ports: Iterable<Port<unknown>>): void {
    for (const port of ports) {
      this.addPort(port)
    }
  }

  removePort(port: Port<unknown>): void {
    this.#ports.delete(port)
    port.setCircuit(undefined)
  }

  removePorts(ports: Iterable<Port<unknown>>): void {
    for (const port of ports) {
      this.removePort(port)
    }
  }

  clearPorts() {
    Object.values(this.#ports).forEach((port) => port.clear())
  }

  hasChild(child: Circuit) {
    return this.#children.has(child)
  }

  addChild(child: Circuit) {
    this.#children.add(child)
    child.#parent = this
    child.recalculateBounds()
    child.recalculatePixelBounds()
  }

  addChildren(children: Iterable<Circuit>) {
    for (const child of children) {
      this.addChild(child)
    }
  }

  removeChild(child: Circuit) {
    this.#children.delete(child)
    child.#parent = undefined
  }

  removeChildren(children: Iterable<Circuit>) {
    for (const child of children) {
      this.removeChild(child)
    }
  }

  updateChildren() {
    this.#children.forEach((child) => child.update())
  }

  tickChildren() {
    this.#children.forEach((child) => child.tick())
  }

  updatePorts() {
    this.#ports.forEach((port) => port.update())
  }

  update() {
    this.updateChildren()
    this.updatePorts()
  }

  tick() {
    this.tickChildren()
  }

  setAllGridSizes(gridSize: number) {
    this.#gridSize = gridSize
    this.#children.forEach((child) => child.setAllGridSizes(gridSize))
    this.recalculateBounds()
    this.recalculatePixelBounds()
  }

  drawBackground(args: DrawArgs) {
    const context = args.context
    context.fillStyle = this.#backgroundColor
    context.fillRect(
      this.#absolutePixelBounds.x,
      this.#absolutePixelBounds.y,
      this.#absolutePixelBounds.width,
      this.#absolutePixelBounds.height
    )
  }

  drawPorts(args: DrawArgs) {
    this.#ports.forEach((port) => port.draw(args))
  }

  drawConnections(args: DrawArgs) {
    this.#ports.forEach((port) =>
      port.connections.forEach((connection) => connection.draw(args))
    )
  }

  drawChildren(args: DrawArgs) {
    this.#children.forEach((child) => child.draw(args))
  }

  drawChildConnections(args: DrawArgs) {
    this.#children.forEach((child) => child.drawConnections(args))
  }

  draw(args: DrawArgs) {
    this.drawBackground(args)
    this.drawChildren(args)
    this.drawPorts(args)
    this.drawChildConnections(args)

    // Only if the are the last parent, draw our own port connections. Otherwise our parent will draw it.
    if (!this.#parent) {
      this.drawConnections(args)
    }
  }

  recalculateBounds(): void {
    const parentBounds = this.#parent?.absoluteBounds
    this.#absoluteBounds.x = parentBounds
      ? parentBounds.x + this.#bounds.x
      : this.#bounds.x
    this.#absoluteBounds.y = parentBounds
      ? parentBounds.y + this.#bounds.y
      : this.#bounds.y
    this.#absoluteBounds.width = this.#bounds.width
    this.#absoluteBounds.height = this.#bounds.height

    // Also recalculate child and port bounds
    this.#children.forEach((child) => child.recalculateBounds())
    this.#ports.forEach((port) => port.recalculateBounds())
  }

  recalculatePixelBounds(): void {
    const bounds = this.#absoluteBounds
    this.#absolutePixelBounds.x = bounds.x * this.#gridSize
    this.#absolutePixelBounds.y = bounds.y * this.#gridSize
    this.#absolutePixelBounds.width = bounds.width * this.#gridSize
    this.#absolutePixelBounds.height = bounds.height * this.#gridSize

    // Also recalculate child and port pixel bounds
    this.#children.forEach((child) => child.recalculatePixelBounds())
    this.#ports.forEach((port) => port.recalculatePixelBounds())
  }
}
