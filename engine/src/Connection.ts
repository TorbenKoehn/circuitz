import Port from './Port.js'
import Signal from './Signal.js'
import { DrawArgs } from './utils.js'

export type ConnectionLineStyle =
  | 'auto'
  | 'vertical'
  | 'horizontal'
  | 'diagonal'

export type ConnectionInit<Value> = {
  readonly source: Port<Value>
  readonly target: Port<Value>
  readonly signalDuration?: number
  readonly lineStyle?: ConnectionLineStyle
}

export default class Connection<Value> {
  #source: Port<Value>
  #target: Port<Value>
  #signalDuration: number
  #lastSignalTime: number = -Infinity
  #lineStyle: ConnectionLineStyle

  #distance: number = 0

  constructor(init: ConnectionInit<Value>) {
    this.#source = init.source
    this.#target = init.target
    this.#signalDuration = init.signalDuration ?? 1000
    this.#lineStyle = init.lineStyle ?? 'auto'

    this.recalculateDistance()
  }

  get source(): Port<Value> {
    return this.#source
  }

  get target(): Port<Value> {
    return this.#target
  }

  get signalFrequency(): number {
    return this.#signalDuration
  }

  get lineStyle(): ConnectionLineStyle {
    return this.#lineStyle
  }

  get distance(): number {
    return this.#distance
  }

  draw(args: DrawArgs): void {
    const context = args.context
    const sourcePortBounds = this.#source.absolutePixelBounds
    const sourceCircuit = this.#source.circuit
    const targetPortBounds = this.#target.absolutePixelBounds
    const targetCircuit = this.#target.circuit

    if (!sourceCircuit || !targetCircuit) {
      return
    }

    const sourceX = sourcePortBounds.x + sourceCircuit.gridSize / 2
    const sourceY = sourcePortBounds.y + sourceCircuit.gridSize / 2
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

    const active = !this.#source.isClear()

    const now = performance.now()

    context.strokeStyle = active ? '#afa' : '#ccc'
    const sourceIsOnRightSideOfCircuit =
      sourcePortBounds.x > sourceCircuit.absolutePixelBounds.width / 2
    const preferVertical = !sourceIsOnRightSideOfCircuit

    const lineStyle = (() => {
      if (this.#lineStyle === 'auto') {
        if (sourceX === targetX || sourceY === targetY) {
          return 'diagonal'
        }

        return preferVertical ? 'vertical' : 'horizontal'
      }

      return this.#lineStyle
    })()

    context.setLineDash([0, 0])
    if (lineStyle === 'diagonal') {
      // Draw straight connection
      context.beginPath()
      context.moveTo(sourceX, sourceY)
      context.lineTo(targetX, targetY)
      context.stroke()
    } else if (lineStyle === 'vertical') {
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

    context.fillStyle = '#040'
    const elapsedSignalTime = now - this.#lastSignalTime
    if (active) {
      const progress = elapsedSignalTime / this.#signalDuration

      if (progress >= 1) {
        this.#lastSignalTime = now
      }

      const dashPosition = -progress * this.#distance
      context.setLineDash([10, 10])
      context.lineDashOffset = dashPosition
      context.stroke()
    } else {
      this.#lastSignalTime = -Infinity
    }
  }

  recalculateDistance(): void {
    const sourcePixelBounds = this.#source?.absolutePixelBounds
    const targetPixelBounds = this.#target?.absolutePixelBounds
    if (!sourcePixelBounds || !targetPixelBounds) {
      this.#distance = 0
    }

    const sourceCenterX = sourcePixelBounds.x + sourcePixelBounds.width / 2
    const sourceCenterY = sourcePixelBounds.y + sourcePixelBounds.height / 2
    const targetCenterX = targetPixelBounds.x + targetPixelBounds.width / 2
    const targetCenterY = targetPixelBounds.y + targetPixelBounds.height / 2

    // Distance is L-shaped, not diagonal
    this.#distance =
      Math.abs(sourceCenterX - targetCenterX) +
      Math.abs(sourceCenterY - targetCenterY)
  }
}
