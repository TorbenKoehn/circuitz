import Circuit from '../../Circuit.js'
import Receiver from '../Receiver.js'
import Sender from '../Sender.js'
import CompoundMux from '../logic-gates/CompoundMux.js'

export default class MuxExample extends Circuit {
  readonly in0: Sender<number>
  readonly select: Sender<number>
  readonly in1: Sender<number>
  readonly mux0: CompoundMux<number>
  readonly mux1: CompoundMux<number>
  readonly mux2: CompoundMux<number>
  readonly mux3: CompoundMux<number>
  readonly out0: Receiver<number>
  readonly out1: Receiver<number>
  readonly out2: Receiver<number>
  readonly out3: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 21, 39),
      backgroundColor: '#666',
    })

    this.in0 = new Sender(0, 9, 1)
    this.select = new Sender(0, 19, 1)
    this.in1 = new Sender(0, 29, 1)
    this.mux0 = new CompoundMux(2, 0, 1)
    this.mux1 = new CompoundMux(2, 10, 1)
    this.mux2 = new CompoundMux(2, 20, 1)
    this.mux3 = new CompoundMux(2, 30, 1)
    this.out0 = new Receiver(20, 4)
    this.out1 = new Receiver(20, 14)
    this.out2 = new Receiver(20, 24)
    this.out3 = new Receiver(20, 34)

    this.addChild(this.in0)
    this.addChild(this.select)
    this.addChild(this.in1)
    this.addChild(this.mux0)
    this.addChild(this.mux1)
    this.addChild(this.mux2)
    this.addChild(this.mux3)
    this.addChild(this.out0)
    this.addChild(this.out1)
    this.addChild(this.out2)
    this.addChild(this.out3)

    this.in0.p0.connect(this.mux0.in0)
    this.in0.p0.connect(this.mux1.in0)
    this.select.p0.connect(this.mux1.select)
    this.select.p0.connect(this.mux3.select)
    this.in1.p0.connect(this.mux2.in1)
    this.in1.p0.connect(this.mux3.in1)
    this.mux0.out.connect(this.out0.p0)
    this.mux1.out.connect(this.out1.p0)
    this.mux2.out.connect(this.out2.p0)
    this.mux3.out.connect(this.out3.p0)
  }
}
