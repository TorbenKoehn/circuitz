import Port from './Port.js'
import { DrawArgs } from './utils.js'

export type CircuitInit = {
  bounds: DOMRect
  gridSize?: number
  backgroundColor?: string
}

export default abstract class Circuit {
  #parent: Circuit | undefined = undefined
  #bounds: DOMRect
  #absoluteBounds: DOMRect = new DOMRect(0, 0, 0, 0)
  #absolutePixelBounds: DOMRect = new DOMRect(0, 0, 0, 0)
  #gridSize: number
  #backgroundColor: string

  #ports: Set<Port<unknown>> = new Set()
  #children: Set<Circuit> = new Set()

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

  set parent(value: Circuit | undefined) {
    if (value && this.#parent && this.#parent !== value) {
      this.#parent.removeChild(this)
    }

    if (!value && this.#parent && this.#parent.hasChild(this)) {
      this.#parent.removeChild(this)
    }

    if (this.#parent !== value) {
      this.#parent = value
    }

    if (value && !value.hasChild(this)) {
      value.addChild(this)
    }
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

  setAllGridSizes(gridSize: number) {
    this.#gridSize = gridSize
    this.#children.forEach((child) => child.setAllGridSizes(gridSize))
    this.recalculateBounds()
    this.recalculatePixelBounds()
  }

  clearPorts() {
    Object.values(this.#ports).forEach((port) => port.clear())
  }

  hasPort(port: Port<unknown>) {
    return this.#ports.has(port)
  }

  addPort<State>(port: Port<State>) {
    this.#ports.add(port)
    port.circuit = this
    port.recalculateBounds()
    port.recalculatePixelBounds()
  }

  removePort(port: Port<unknown>) {
    this.#ports.delete(port)
    port.circuit = undefined
  }

  hasChild(child: Circuit) {
    return this.#children.has(child)
  }

  addChild(child: Circuit) {
    this.#children.add(child)
    child.parent = this
    child.recalculateBounds()
    child.recalculatePixelBounds()
  }

  removeChild(child: Circuit) {
    this.#children.delete(child)
    child.parent = undefined
  }

  tickPorts() {
    this.#ports.forEach((port) => port.tick())
  }

  tickChildren() {
    this.#children.forEach((child) => child.tick())
  }

  tick() {
    this.tickPorts()
    this.tickChildren()
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

  drawPortConnections(args: DrawArgs) {
    const context = args.context
    context.lineWidth = 2
    for (const port of this.#ports) {
      for (const connection of port.connections) {
        const sourcePortBounds = port.absolutePixelBounds
        const targetPortBounds = connection.target.absolutePixelBounds
        const targetCircuit = connection.target.circuit

        if (!targetCircuit) {
          continue
        }

        const sourceX = sourcePortBounds.x + this.gridSize / 2
        const sourceY = sourcePortBounds.y + this.gridSize / 2
        const targetX = targetPortBounds.x + targetCircuit.gridSize / 2
        const targetY = targetPortBounds.y + targetCircuit.gridSize / 2

        // Draw a small red dot on both ends to signify "connected"
        context.fillStyle = '#333'
        context.beginPath()
        context.arc(sourceX, sourceY, 3, 0, 2 * Math.PI)
        context.fill()
        context.beginPath()
        context.arc(targetX, targetY, 3, 0, 2 * Math.PI)
        context.fill()

        context.strokeStyle = connection.signals.length > 0 ? '#cfc' : '#ccc'
        const sourceIsOnRightSideOfCircuit =
          sourcePortBounds.x > this.absolutePixelBounds.width / 2
        const preferVertical = !sourceIsOnRightSideOfCircuit

        if (sourceX === targetX || sourceY === targetY) {
          // Draw straight connection
          context.beginPath()
          context.moveTo(sourceX, sourceY)
          context.lineTo(targetX, targetY)
          context.stroke()
        } else if (preferVertical) {
          // Draw L-shaped connection: vertical first, then horizontal
          context.beginPath()
          context.moveTo(sourceX, sourceY)
          context.lineTo(sourceX, targetY) // Vertical line
          context.lineTo(targetX, targetY) // Horizontal line
          context.stroke()
        } else {
          // Draw L-shaped connection: horizontal first, then vertical
          context.beginPath()
          context.moveTo(sourceX, sourceY)
          context.lineTo(targetX, sourceY) // Horizontal line
          context.lineTo(targetX, targetY) // Vertical line
          context.stroke()
        }

        const verticalLength = Math.abs(targetY - sourceY)
        const horizontalLength = Math.abs(targetX - sourceX)
        const totalLength = verticalLength + horizontalLength

        context.fillStyle = 'green'
        for (const signal of connection.signals) {
          const progress = connection.getSignalProgress(signal)

          if (progress >= 1) {
            continue
          }

          const traveledDistance = progress * totalLength
          let x, y

          if (sourceX === targetX) {
            // Vertical segment
            x = sourceX
            y = sourceY + (targetY - sourceY) * progress
          } else if (sourceY === targetY) {
            // Horizontal segment
            x = sourceX + (targetX - sourceX) * progress
            y = sourceY
          } else if (preferVertical) {
            if (traveledDistance <= verticalLength) {
              // Signal is in the vertical segment
              const segmentProgress = traveledDistance / verticalLength // Normalize to [0, 1]
              x = sourceX // X remains constant
              y = sourceY + (targetY - sourceY) * segmentProgress
            } else {
              // Signal is in the horizontal segment
              const segmentProgress =
                (traveledDistance - verticalLength) / horizontalLength // Normalize to [0, 1]
              x = sourceX + (targetX - sourceX) * segmentProgress
              y = targetY // Y remains constant
            }
          } else {
            if (traveledDistance <= horizontalLength) {
              // Signal is in the horizontal segment
              const segmentProgress = traveledDistance / horizontalLength // Normalize to [0, 1]
              x = sourceX + (targetX - sourceX) * segmentProgress
              y = sourceY // Y remains constant
            } else {
              // Signal is in the vertical segment
              const segmentProgress =
                (traveledDistance - horizontalLength) / verticalLength // Normalize to [0, 1]
              x = targetX // X remains constant
              y = sourceY + (targetY - sourceY) * segmentProgress
            }
          }

          context.beginPath()
          context.arc(x, y, 4, 0, 2 * Math.PI)
          context.fill()
        }
      }
    }
  }

  drawChildren(args: DrawArgs) {
    this.#children.forEach((child) => child.draw(args))
  }

  drawChildPortConnections(args: DrawArgs) {
    this.#children.forEach((child) => child.drawPortConnections(args))
  }

  draw(args: DrawArgs) {
    this.drawBackground(args)
    this.drawChildren(args)
    this.drawPorts(args)
    this.drawChildPortConnections(args)
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
