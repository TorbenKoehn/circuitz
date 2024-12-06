import Circuit from '../../Circuit.js'
import Port from '../../Port.js'
import NandGate from './NandGate.js'
import Repeater from './../Repeater.js'

export default class CompoundXnorGate<Value> extends Circuit {
  readonly value: Value
  readonly in0: Port<Value>
  readonly in1: Port<Value>
  readonly in1Repeat0: Repeater<Value>
  readonly in1Repeat1: Repeater<Value>
  readonly in2Repeat0: Repeater<Value>
  readonly in2Repeat1: Repeater<Value>
  readonly nand0: NandGate<Value>
  readonly nand1: NandGate<Value>
  readonly nand2: NandGate<Value>
  readonly nand3: NandGate<Value>
  readonly nand4: NandGate<Value>
  readonly out: Port<Value>

  constructor(x: number, y: number, value: Value, clearValue: Value) {
    super({
      bounds: new DOMRect(x, y, 19, 11),
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
    this.in1Repeat0 = new Repeater(2, 1, clearValue)
    this.in1Repeat1 = new Repeater(2, 8, clearValue)
    this.in2Repeat0 = new Repeater(4, 5, clearValue)
    this.in2Repeat1 = new Repeater(4, 10, clearValue)
    this.nand0 = new NandGate(6, 0, value, clearValue)
    this.nand1 = new NandGate(6, 4, value, clearValue)
    this.nand2 = new NandGate(10, 2, value, clearValue)
    this.nand3 = new NandGate(10, 8, value, clearValue)
    this.nand4 = new NandGate(14, 5, value, clearValue)
    this.out = new Port({
      position: new DOMPoint(18, 6),
      clearValue,
    })
    this.addPort(this.in0)
    this.addPort(this.in1)
    this.addPort(this.out)

    this.addChild(this.in1Repeat0)
    this.addChild(this.in1Repeat1)
    this.addChild(this.in2Repeat0)
    this.addChild(this.in2Repeat1)
    this.addChild(this.nand0)
    this.addChild(this.nand1)
    this.addChild(this.nand2)
    this.addChild(this.nand3)
    this.addChild(this.nand4)

    this.in0.connect(this.in1Repeat0.p0)
    this.in1Repeat0.p0.connect(this.nand0.in0)
    this.in1Repeat0.p0.connect(this.nand0.in1)
    this.in1Repeat0.p0.connect(this.in1Repeat1.p0)
    this.in1.connect(this.in2Repeat0.p0)
    this.in2Repeat0.p0.connect(this.nand1.in0)
    this.in2Repeat0.p0.connect(this.nand1.in1)
    this.in2Repeat0.p0.connect(this.in2Repeat1.p0)
    this.in1Repeat1.p0.connect(this.nand3.in0)
    this.in2Repeat1.p0.connect(this.nand3.in1)
    this.nand0.out.connect(this.nand2.in0)
    this.nand1.out.connect(this.nand2.in1)
    this.nand2.out.connect(this.nand4.in0)
    this.nand3.out.connect(this.nand4.in1)
    this.nand4.out.connect(this.out)
  }
}
