import Circuit from '../../Circuit.js'
import Receiver from '../Receiver.js'
import Sender from '../Sender.js'
import NandGate from '../logic-gates/NandGate.js'

export default class NandExample extends Circuit {
  readonly in: Sender<number>
  readonly nandNeither: NandGate<number>
  readonly nandIn1: NandGate<number>
  readonly nandIn2: NandGate<number>
  readonly nandBoth: NandGate<number>
  readonly out0: Receiver<number>
  readonly out1: Receiver<number>
  readonly out2: Receiver<number>
  readonly out3: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 7, 15),
      backgroundColor: '#666',
    })

    this.in = new Sender(0, 7, 1)
    this.nandNeither = new NandGate(2, 0, 1)
    this.nandIn1 = new NandGate(2, 4, 1)
    this.nandIn2 = new NandGate(2, 8, 1)
    this.nandBoth = new NandGate(2, 12, 1)
    this.out0 = new Receiver(6, 1)
    this.out1 = new Receiver(6, 5)
    this.out2 = new Receiver(6, 9)
    this.out3 = new Receiver(6, 13)

    this.addChild(this.in)
    this.addChild(this.nandNeither)
    this.addChild(this.nandIn1)
    this.addChild(this.nandIn2)
    this.addChild(this.nandBoth)
    this.addChild(this.out0)
    this.addChild(this.out1)
    this.addChild(this.out2)
    this.addChild(this.out3)

    this.in.p0.connect(this.nandIn1.in0)
    this.in.p0.connect(this.nandIn2.in1)
    this.in.p0.connect(this.nandBoth.in0)
    this.in.p0.connect(this.nandBoth.in1)
    this.nandNeither.out.connect(this.out0.p0)
    this.nandIn1.out.connect(this.out1.p0)
    this.nandIn2.out.connect(this.out2.p0)
    this.nandBoth.out.connect(this.out3.p0)
  }
}
