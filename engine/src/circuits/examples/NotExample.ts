import Circuit from '../../Circuit.js'
import Receiver from '../Receiver.js'
import Sender from '../Sender.js'
import CompoundNotGate from '../logic-gates/CompundNotGate.js'

export default class NotExample extends Circuit {
  readonly in: Sender<number>
  readonly notGate: CompoundNotGate<number>
  readonly out: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 13, 5),
      backgroundColor: '#666',
    })

    this.in = new Sender({
      position: new DOMPoint(1, 2),
      value: 1,
      clearValue: 0,
      keyboardKey: 'KeyS',
    })
    this.notGate = new CompoundNotGate(3, 1, 1, 0)
    this.out = new Receiver({ position: new DOMPoint(11, 2), clearValue: 0 })

    this.addChild(this.in)
    this.addChild(this.notGate)
    this.addChild(this.out)

    this.in.p0.connect(this.notGate.in)
    this.notGate.out.connect(this.out.p0)
  }
}
