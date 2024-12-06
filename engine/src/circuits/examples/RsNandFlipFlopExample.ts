import Circuit from '../../Circuit.js'
import Sender from '../Sender.js'
import Receiver from '../Receiver.js'
import CompoundRsNandFlipFlop from '../flip-flops/CompoundRsNandFlipFlop.js'

export default class RsNorFlipFlopExample extends Circuit {
  readonly set: Sender<number>
  readonly reset: Sender<number>
  readonly flipFlop: CompoundRsNandFlipFlop<number>
  readonly out0: Receiver<number>
  readonly out1: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 15, 9),
      backgroundColor: '#666',
    })

    this.set = new Sender({
      position: new DOMPoint(1, 2),
      value: 1,
      clearValue: 0,
      keyboardKey: 'KeyS',
    })

    this.reset = new Sender({
      position: new DOMPoint(1, 6),
      value: 1,
      clearValue: 0,
      keyboardKey: 'KeyR',
    })
    this.flipFlop = new CompoundRsNandFlipFlop(3, 1, 1, 0)
    this.out0 = new Receiver({ position: new DOMPoint(17, 2), clearValue: 0 })
    this.out1 = new Receiver({ position: new DOMPoint(17, 6), clearValue: 0 })

    this.addChildren([
      this.set,
      this.reset,
      this.flipFlop,
      this.out0,
      this.out1,
    ])

    this.set.p0.connect(this.flipFlop.set)
    this.reset.p0.connect(this.flipFlop.reset)
    this.flipFlop.out0.connect(this.out0.p0)
    this.flipFlop.out1.connect(this.out1.p0)
  }
}
