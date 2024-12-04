import Circuit from './Circuit.js'

export type SimulationOptions = {
  readonly circuit: Circuit
  readonly canvas?: HTMLCanvasElement
  readonly gridSize?: number
  readonly tickInterval?: number
  readonly showFps?: boolean
}

export type SimulationStartOptions = {
  signal?: AbortSignal
}

export default class Simulation {
  readonly circuit: Circuit
  readonly canvas: HTMLCanvasElement

  #tickInterval: number
  #showFps: boolean

  #lastFps: number = 0
  #lastSecond: number = 0
  #currentFps: number = 0

  constructor(options: SimulationOptions) {
    this.circuit = options.circuit
    this.canvas = options.canvas ?? document.createElement('canvas')
    this.#tickInterval = options.tickInterval ?? 100
    this.#showFps = options.showFps ?? false
  }

  maximizeCanvas(): void {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  start(options?: SimulationStartOptions): void {
    addEventListener('resize', () => this.maximizeCanvas(), {
      signal: options?.signal,
    })
    this.maximizeCanvas()

    const context = this.canvas.getContext('2d')!

    let lastTickTime = performance.now()
    const update = () => {
      if (options?.signal?.aborted) {
        return
      }

      requestAnimationFrame(update)
      const currentTime = performance.now()
      const currentSecond = Math.floor(currentTime / 1000)
      const tickDelta = currentTime - lastTickTime
      if (tickDelta > this.#tickInterval) {
        this.circuit.tick()
        lastTickTime = currentTime
      }

      context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.circuit.draw({
        context,
      })

      if (this.#showFps) {
        if (currentSecond !== this.#lastSecond) {
          this.#lastFps = this.#currentFps
          this.#currentFps = 0
          this.#lastSecond = currentSecond
        }

        this.#currentFps++
        context.fillStyle = 'white'
        context.textAlign = 'left'
        context.font = '12px monospace'
        context.fillText(`FPS: ${this.#lastFps}`, 10, 20)
      }
    }

    update()
  }
}
