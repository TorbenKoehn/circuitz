import Circuit from '../../Circuit.js'
import Receiver from '../Receiver.js'
import Sender from '../Sender.js'
import CompoundNotGate from '../logic-gates/CompundNotGate.js'

export default class NotExample extends Circuit {
  readonly in: Sender<number>
  readonly notActive: CompoundNotGate<number>
  readonly notInactive: CompoundNotGate<number>
  readonly out0: Receiver<number>
  readonly out1: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 11, 7),
      backgroundColor: '#666',
    })

    this.in = new Sender(0, 3, 1)
    this.notActive = new CompoundNotGate(2, 0, 1)
    this.notInactive = new CompoundNotGate(2, 4, 1)
    this.out0 = new Receiver(10, 1)
    this.out1 = new Receiver(10, 5)

    this.addChild(this.in)
    this.addChild(this.notActive)
    this.addChild(this.notInactive)
    this.addChild(this.out0)
    this.addChild(this.out1)

    this.in.p0.connect(this.notInactive.in)
    this.notActive.out.connect(this.out0.p0)
    this.notInactive.out.connect(this.out1.p0)
  }
}
