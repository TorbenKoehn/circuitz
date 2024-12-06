import Circuit from '../../Circuit.js'
import Receiver from '../Receiver.js'
import Sender from '../Sender.js'
import Microcontroller from '../Microcontroller.js'

export default class McExample extends Circuit {
  readonly in1: Sender<number>
  readonly mc1: Microcontroller
  readonly mc2: Microcontroller
  readonly out1: Receiver<number>

  constructor(x: number, y: number) {
    super({
      bounds: new DOMRect(x, y, 27, 14),
      backgroundColor: '#666',
    })

    this.in1 = new Sender({
      position: new DOMPoint(1, 3),
      value: 2,
      clearValue: 0,
      keyboardKey: 'KeyA',
    })
    this.mc1 = new Microcontroller({
      position: new DOMPoint(3, 3),
      stack: [
        { command: 'mov', args: ['p0', 'acc'] },
        { command: 'sub', args: ['2'] },
        { label: 'loop', command: 'nop', args: [] },
        { command: 'add', args: ['1'] },
        { command: 'cmp', args: ['acc', '5'] },
        { command: 'jl', args: ['loop'] },
        { command: 'mov', args: ['acc', 'p2'] },
        { label: 'end', command: 'slp', args: ['2'] },
      ],
    })

    this.mc2 = new Microcontroller({
      position: new DOMPoint(14, 3),
      stack: [
        { command: 'mov', args: ['p0', 'acc'] },
        { command: 'mul', args: ['4'] },
        { command: 'mov', args: ['acc', 'p2'] },
        { command: 'slp', args: ['2'] },
        { command: 'rsp', args: [] },
      ],
    })
    this.out1 = new Receiver({ position: new DOMPoint(25, 3), clearValue: 0 })

    this.addChild(this.in1)
    this.addChild(this.out1)
    this.addChild(this.mc1)
    this.addChild(this.mc2)

    this.in1.p0.connect(this.mc1.p0)
    this.mc1.p2.connect(this.mc2.p0)
    this.mc2.p2.connect(this.out1.p0)
  }
}
