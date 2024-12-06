import Circuit from '../../Circuit.js'
import Keyboard from '../../Keyboard.js'
import Port from '../../Port.js'
import NandGate from '../logic-gates/NandGate.js'
import NotGate from '../logic-gates/NotGate.js'
import Repeater from '../Repeater.js'

export default class CompoundRsNandFlipFlop<Value> extends Circuit {
  readonly set: Port<Value>
  readonly reset: Port<Value>
  readonly not0: NotGate<Value>
  readonly not1: NotGate<Value>
  readonly nand0: NandGate<Value>
  readonly nand1: NandGate<Value>
  readonly nand0Repeat: Repeater<Value>
  readonly nand1Repeat: Repeater<Value>
  readonly out0: Port<Value>
  readonly out1: Port<Value>

  constructor(x: number, y: number, value: Value, clearValue: Value) {
    super({
      bounds: new DOMRect(x, y, 9, 7),
      backgroundColor: '#555',
    })

    this.set = new Port({
      position: new DOMPoint(0, 1),
      clearValue,
    })
    this.reset = new Port({
      position: new DOMPoint(0, 5),
      clearValue,
    })
    this.not0 = new NotGate(2, 1, value, clearValue)
    this.not1 = new NotGate(2, 5, value, clearValue)
    this.nand0 = new NandGate(6, 0, value, clearValue)
    this.nand1 = new NandGate(6, 4, value, clearValue)
    this.nand0Repeat = new Repeater(10, 1, clearValue)
    this.nand1Repeat = new Repeater(10, 5, clearValue)
    this.out0 = new Port({
      position: new DOMPoint(12, 1),
      clearValue,
    })
    this.out1 = new Port({
      position: new DOMPoint(12, 5),
      clearValue,
    })

    this.addChildren([
      this.not0,
      this.not1,
      this.nand0,
      this.nand1,
      this.nand0Repeat,
      this.nand1Repeat,
    ])
    this.addPorts([this.set, this.reset, this.out0, this.out1])

    this.set.connect(this.not0.in)
    this.reset.connect(this.not1.in)
    this.not0.out.connect(this.nand0.in0)
    this.not1.out.connect(this.nand1.in1)
    this.nand0.out.connect(this.nand0Repeat.p0)
    this.nand0Repeat.p0.connect(this.nand1.in0, { lineStyle: 'diagonal' })
    this.nand1.out.connect(this.nand1Repeat.p0)
    this.nand1Repeat.p0.connect(this.nand0.in1, { lineStyle: 'diagonal' })
    this.nand0Repeat.p0.connect(this.out0)
    this.nand1Repeat.p0.connect(this.out1)
  }
}
