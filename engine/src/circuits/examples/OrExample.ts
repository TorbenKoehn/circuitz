import Circuit from '../../Circuit.js'
import Receiver from '../Receiver.js'
import Sender from '../Sender.js'
import CompoundOrGate from '../logic-gates/CompoundOrGate.js'

export default class OrExample extends Circuit {
  readonly in: Sender<number>
  readonly orNeither: CompoundOrGate<number>
  readonly orIn1: CompoundOrGate<number>
  readonly orIn2: CompoundOrGate<number>
  readonly orBoth: CompoundOrGate<number>
  readonly out0: Receiver<number>
  readonly out1: Receiver<number>
  readonly out2: Receiver<number>
  readonly out3: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 15, 31),
      backgroundColor: '#666',
    })

    this.in = new Sender(0, 15, 1)
    this.orNeither = new CompoundOrGate(2, 0, 1)
    this.orIn1 = new CompoundOrGate(2, 8, 1)
    this.orIn2 = new CompoundOrGate(2, 16, 1)
    this.orBoth = new CompoundOrGate(2, 24, 1)
    this.out0 = new Receiver(14, 3)
    this.out1 = new Receiver(14, 11)
    this.out2 = new Receiver(14, 19)
    this.out3 = new Receiver(14, 27)

    this.addChild(this.in)
    this.addChild(this.orNeither)
    this.addChild(this.orIn1)
    this.addChild(this.orIn2)
    this.addChild(this.orBoth)
    this.addChild(this.out0)
    this.addChild(this.out1)
    this.addChild(this.out2)
    this.addChild(this.out3)

    this.in.p0.connect(this.orIn1.in0)
    this.in.p0.connect(this.orIn2.in1)
    this.in.p0.connect(this.orBoth.in0)
    this.in.p0.connect(this.orBoth.in1)
    this.orNeither.out.connect(this.out0.p0)
    this.orIn1.out.connect(this.out1.p0)
    this.orIn2.out.connect(this.out2.p0)
    this.orBoth.out.connect(this.out3.p0)
  }
}
