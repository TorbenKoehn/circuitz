import Circuit from '../Circuit.js'
import Port from '../Port.js'

export default class Receiver<State> extends Circuit {
  readonly p0: Port<State>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 1, 1),
    })

    this.p0 = new Port({
      position: new DOMPoint(0, 0),
      access: ['read', 'receive'],
    })
    this.addPort(this.p0)
  }

  tick() {
    super.tick()

    if (this.p0.dataAvailable) {
      this.p0.readAll()
    }
  }
}
