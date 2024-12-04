import Circuit from '../../Circuit.js'
import Sender from '../Sender.js'
import CompoundXnorGate from '../logic-gates/CompoundXnorGate.js'
import Receiver from '../Receiver.js'

export default class XnorExample extends Circuit {
  readonly in: Sender<number>
  readonly xnorNeither: CompoundXnorGate<number>
  readonly xnorIn1: CompoundXnorGate<number>
  readonly xnorIn2: CompoundXnorGate<number>
  readonly xnorBoth: CompoundXnorGate<number>
  readonly out0: Receiver<number>
  readonly out1: Receiver<number>
  readonly out2: Receiver<number>
  readonly out3: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 23, 47),
      backgroundColor: '#666',
    })

    this.in = new Sender(0, 23, 1)
    this.xnorNeither = new CompoundXnorGate(2, 0, 1)
    this.xnorIn1 = new CompoundXnorGate(2, 12, 1)
    this.xnorIn2 = new CompoundXnorGate(2, 24, 1)
    this.xnorBoth = new CompoundXnorGate(2, 36, 1)
    this.out0 = new Receiver(22, 6)
    this.out1 = new Receiver(22, 18)
    this.out2 = new Receiver(22, 30)
    this.out3 = new Receiver(22, 42)

    this.addChild(this.in)
    this.addChild(this.xnorNeither)
    this.addChild(this.xnorIn1)
    this.addChild(this.xnorIn2)
    this.addChild(this.xnorBoth)
    this.addChild(this.out0)
    this.addChild(this.out1)
    this.addChild(this.out2)
    this.addChild(this.out3)

    this.in.p0.connect(this.xnorIn1.in0)
    this.in.p0.connect(this.xnorIn2.in1)
    this.in.p0.connect(this.xnorBoth.in0)
    this.in.p0.connect(this.xnorBoth.in1)
    this.xnorNeither.out.connect(this.out0.p0)
    this.xnorIn1.out.connect(this.out1.p0)
    this.xnorIn2.out.connect(this.out2.p0)
    this.xnorBoth.out.connect(this.out3.p0)
  }
}
