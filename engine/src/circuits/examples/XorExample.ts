import Circuit from '../../Circuit.js'
import Receiver from '../Receiver.js'
import Sender from '../Sender.js'
import CompoundXorGate from '../logic-gates/CompoundXorGate.js'

export default class XorExample extends Circuit {
  readonly in: Sender<number>
  readonly xorNeither: CompoundXorGate<number>
  readonly xorIn1: CompoundXorGate<number>
  readonly xorIn2: CompoundXorGate<number>
  readonly xorBoth: CompoundXorGate<number>
  readonly out0: Receiver<number>
  readonly out1: Receiver<number>
  readonly out2: Receiver<number>
  readonly out3: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 19, 31),
      backgroundColor: '#666',
    })

    this.in = new Sender(0, 15, 1)
    this.xorNeither = new CompoundXorGate(2, 0, 1)
    this.xorIn1 = new CompoundXorGate(2, 8, 1)
    this.xorIn2 = new CompoundXorGate(2, 16, 1)
    this.xorBoth = new CompoundXorGate(2, 24, 1)
    this.out0 = new Receiver(18, 3)
    this.out1 = new Receiver(18, 11)
    this.out2 = new Receiver(18, 19)
    this.out3 = new Receiver(18, 27)

    this.addChild(this.in)
    this.addChild(this.xorNeither)
    this.addChild(this.xorIn1)
    this.addChild(this.xorIn2)
    this.addChild(this.xorBoth)
    this.addChild(this.out0)
    this.addChild(this.out1)
    this.addChild(this.out2)
    this.addChild(this.out3)

    this.in.p0.connect(this.xorIn1.in0)
    this.in.p0.connect(this.xorIn2.in1)
    this.in.p0.connect(this.xorBoth.in0)
    this.in.p0.connect(this.xorBoth.in1)
    this.xorNeither.out.connect(this.out0.p0)
    this.xorIn1.out.connect(this.out1.p0)
    this.xorIn2.out.connect(this.out2.p0)
    this.xorBoth.out.connect(this.out3.p0)
  }
}
