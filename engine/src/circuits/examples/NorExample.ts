import Circuit from '../../Circuit.js'
import Receiver from '../Receiver.js'
import Sender from '../Sender.js'
import CompoundNorGate from '../logic-gates/CompoundNorGate.js'

export default class NorExample extends Circuit {
  readonly in0: Sender<number>
  readonly in1: Sender<number>
  readonly norGate: CompoundNorGate<number>
  readonly out: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 21, 9),
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

    this.norGate = new CompoundNorGate(3, 1, 1, 0)
    this.out = new Receiver({ position: new DOMPoint(19, 4), clearValue: 0 })

    this.addChild(this.in0)
    this.addChild(this.in1)
    this.addChild(this.norGate)
    this.addChild(this.out)

    this.in0.p0.connect(this.norGate.in0)
    this.in1.p0.connect(this.norGate.in1)
    this.norGate.out.connect(this.out.p0)
  }
}
