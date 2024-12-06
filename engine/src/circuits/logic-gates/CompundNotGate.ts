import Circuit from '../../Circuit.js'
import Port from '../../Port.js'
import NandGate from './NandGate.js'

export default class CompoundNotGate<Value> extends Circuit {
  readonly value: Value;
  readonly in: Port<Value>
  readonly nand: NandGate<Value>
  readonly out: Port<Value>

  constructor(x: number, y: number, value: Value, clearValue: Value) {
    super({
      bounds: new DOMRect(x, y, 7, 3),
      backgroundColor: '#555',
    })

    this.value = value
    this.in = new Port({
      position: new DOMPoint(0, 1),
      clearValue,
    })
    this.nand = new NandGate(2, 0, value, clearValue)
    this.out = new Port({
      position: new DOMPoint(6, 1),
      clearValue,
    })
    this.addPort(this.in)
    this.addPort(this.out)

    this.addChild(this.nand)

    this.in.connect(this.nand.in0)
    this.in.connect(this.nand.in1)
    this.nand.out.connect(this.out)
  }

  tick() {
    super.tick()
  }
}
