import Circuit from '../../Circuit.js'
import Sender from '../Sender.js'
import CompoundAndGate from '../logic-gates/CompoundAndGate.js'
import Receiver from '../Receiver.js'

export default class AndExample extends Circuit {
  readonly in: Sender<number>
  readonly andNeither: CompoundAndGate<number>
  readonly andIn1: CompoundAndGate<number>
  readonly andIn2: CompoundAndGate<number>
  readonly andBoth: CompoundAndGate<number>
  readonly out0: Receiver<number>
  readonly out1: Receiver<number>
  readonly out2: Receiver<number>
  readonly out3: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 15, 15),
      backgroundColor: '#666',
    })

    this.in = new Sender(0, 7, 1)
    this.andNeither = new CompoundAndGate(2, 0, 1)
    this.andIn1 = new CompoundAndGate(2, 4, 1)
    this.andIn2 = new CompoundAndGate(2, 8, 1)
    this.andBoth = new CompoundAndGate(2, 12, 1)
    this.out0 = new Receiver(14, 1)
    this.out1 = new Receiver(14, 5)
    this.out2 = new Receiver(14, 9)
    this.out3 = new Receiver(14, 13)

    this.addChild(this.in)
    this.addChild(this.andNeither)
    this.addChild(this.andIn1)
    this.addChild(this.andIn2)
    this.addChild(this.andBoth)
    this.addChild(this.out0)
    this.addChild(this.out1)
    this.addChild(this.out2)
    this.addChild(this.out3)

    this.in.p0.connect(this.andIn1.in0)
    this.in.p0.connect(this.andIn2.in1)
    this.in.p0.connect(this.andBoth.in0)
    this.in.p0.connect(this.andBoth.in1)
    this.andNeither.out.connect(this.out0.p0)
    this.andIn1.out.connect(this.out1.p0)
    this.andIn2.out.connect(this.out2.p0)
    this.andBoth.out.connect(this.out3.p0)
  }
}
