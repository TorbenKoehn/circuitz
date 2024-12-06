import Circuit from '../../Circuit.js'
import Port from '../../Port.js'
import NandGate from './NandGate.js'

export default class CompoundNorGate<Value> extends Circuit {
  readonly value: Value
  readonly in0: Port<Value>
  readonly in1: Port<Value>
  readonly nand0: NandGate<Value>
  readonly nand1: NandGate<Value>
  readonly nand2: NandGate<Value>
  readonly nand3: NandGate<Value>
  readonly out: Port<Value>

  constructor(x: number, y: number, value: Value, clearValue: Value) {
    super({
      bounds: new DOMRect(x, y, 15, 7),
      backgroundColor: '#555',
    })

    this.value = value
    this.in0 = new Port({
      position: new DOMPoint(0, 1),
      clearValue,
    })
    this.in1 = new Port({
      position: new DOMPoint(0, 5),
      clearValue,
    })
    this.nand0 = new NandGate(2, 0, value, clearValue)
    this.nand1 = new NandGate(2, 4, value, clearValue)
    this.nand2 = new NandGate(6, 2, value, clearValue)
    this.nand3 = new NandGate(10, 2, value, clearValue)
    this.out = new Port({
      position: new DOMPoint(14, 3),
      clearValue,
    })
    this.addPort(this.in0)
    this.addPort(this.in1)
    this.addPort(this.out)

    this.addChild(this.nand0)
    this.addChild(this.nand1)
    this.addChild(this.nand2)
    this.addChild(this.nand3)

    this.in0.connect(this.nand0.in0)
    this.in0.connect(this.nand0.in1)
    this.in1.connect(this.nand1.in0)
    this.in1.connect(this.nand1.in1)
    this.nand0.out.connect(this.nand2.in0)
    this.nand1.out.connect(this.nand2.in1)
    this.nand2.out.connect(this.nand3.in0)
    this.nand2.out.connect(this.nand3.in1)
    this.nand3.out.connect(this.out)
  }
}
