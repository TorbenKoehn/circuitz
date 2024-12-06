import Circuit from '../../Circuit.js'
import Receiver from '../Receiver.js'
import Sender from '../Sender.js'
import CompoundOrGate from '../logic-gates/CompoundOrGate.js'

export default class OrExample extends Circuit {
  readonly in0: Sender<number>
  readonly in1: Sender<number>
  readonly orGate: CompoundOrGate<number>
  readonly out0: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 17, 9),
      backgroundColor: '#666',
    })

    this.in0 = new Sender({
      position: new DOMPoint(1, 2),
      value: 1,
      clearValue: 0,
      keyboardKey: 'KeyA',
    })
    this.in1 = new Sender({
      position: new DOMPoint(1, 6),
      value: 1,
      clearValue: 0,
      keyboardKey: 'KeyB',
    })
    this.orGate = new CompoundOrGate(3, 1, 1, 0)
    this.out0 = new Receiver({ position: new DOMPoint(15, 4), clearValue: 0 })

    this.addChild(this.in0)
    this.addChild(this.in1)
    this.addChild(this.orGate)
    this.addChild(this.out0)

    this.in0.p0.connect(this.orGate.in0)
    this.in1.p0.connect(this.orGate.in1)
    this.orGate.out.connect(this.out0.p0)
  }
}
