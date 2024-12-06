import Circuit from '../../Circuit.js'
import Sender from '../Sender.js'
import CompoundAndGate from '../logic-gates/CompoundAndGate.js'
import Receiver from '../Receiver.js'

export default class AndExample extends Circuit {
  readonly in0: Sender<number>
  readonly in1: Sender<number>
  readonly andGate: CompoundAndGate<number>
  readonly out: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 17, 5),
      backgroundColor: '#666',
    })

    this.in0 = new Sender({
      position: new DOMPoint(1, 1),
      value: 1,
      clearValue: 0,
      keyboardKey: 'KeyA',
    })

    this.in1 = new Sender({
      position: new DOMPoint(1, 3),
      value: 1,
      clearValue: 0,
      keyboardKey: 'KeyB',
    })
    this.andGate = new CompoundAndGate(3, 1, 1, 0)
    this.out = new Receiver({ position: new DOMPoint(15, 2), clearValue: 0 })

    this.addChildren([this.in0, this.in1, this.andGate, this.out])

    this.in0.p0.connect(this.andGate.in0)
    this.in1.p0.connect(this.andGate.in1)
    this.andGate.out.connect(this.out.p0)
  }
}
