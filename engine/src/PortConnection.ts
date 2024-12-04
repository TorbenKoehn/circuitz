import Port from './Port.js'
import Signal from './Signal.js'

export default class PortConnection<Value> {
  readonly source: Port<Value>
  readonly target: Port<Value>
  readonly signals: Signal<Value>[] = []
  readonly transmissionSpeed: number

  #distance: number = 0

  constructor(
    source: Port<Value>,
    target: Port<Value>,
    transmissionSpeed: number = 0.4
  ) {
    this.source = source
    this.target = target
    this.transmissionSpeed = transmissionSpeed

    this.recalculateDistance()
  }

  get distance(): number {
    return this.#distance
  }

  getSignalProgress(signal: Signal<Value>): number {
    const elapsedTime = performance.now() - signal.startTime
    return Math.min(1, elapsedTime / (this.distance / this.transmissionSpeed))
  }

  hasSignalArrived(signal: Signal<Value>): boolean {
    return this.getSignalProgress(signal) >= 1
  }

  dispatch(state: Value): void {
    this.signals.push(new Signal(state, performance.now()))
  }

  tick(): void {
    const arrivedSignals = this.signals.filter((signal) =>
      this.hasSignalArrived(signal)
    )
    // Remove arrived signals from the queue
    const indexes = arrivedSignals.map((signal) => this.signals.indexOf(signal))
    indexes.forEach((index) => this.signals.splice(index, 1))

    arrivedSignals.forEach((signal) => {
      this.target.receive(signal.value)
    })
  }

  recalculateDistance(): void {
    const sourcePixelBounds = this.source?.absolutePixelBounds
    const targetPixelBounds = this.target?.absolutePixelBounds
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
