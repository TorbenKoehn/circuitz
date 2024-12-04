import Circuit from '../Circuit.js'
import Port from '../Port.js'

export default class Repeater<Value> extends Circuit {
  readonly value: Value
  readonly p0: Port<Value>

  constructor(x: number, y: number, value: Value) {
    super({
      bounds: new DOMRect(x, y, 1, 1),
    })

    this.value = value
    this.p0 = new Port({
      position: new DOMPoint(0, 0),
      access: ['receive', 'send'],
    })
    this.addPort(this.p0)
  }
}
