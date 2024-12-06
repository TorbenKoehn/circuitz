import Circuit from '../Circuit.js'
import Port from '../Port.js'

export type ReceiverInit<Value> = {
  position: DOMPoint
  clearValue: Value
}

export default class Receiver<Value> extends Circuit {
  readonly p0: Port<Value>

  constructor(init: ReceiverInit<Value>) {
    super({
      bounds: new DOMRect(init.position.x, init.position.y, 1, 1),
    })

    this.p0 = new Port({
      position: new DOMPoint(0, 0),
      clearValue: init.clearValue,
    })
    this.addPort(this.p0)
  }

  update() {
    super.update()
    this.p0.read()
  }
}
