import Circuit from '../../Circuit.js'
import Port from '../../Port.js'
import { DrawArgs } from '../../utils.js'

export default class NandGate<Value> extends Circuit {
  readonly value: Value
  readonly in0: Port<Value>
  readonly in1: Port<Value>
  readonly out: Port<Value>

  constructor(x: number, y: number, value: Value, clearValue: Value) {
    super({
      bounds: new DOMRect(x, y, 3, 3),
    })

    this.value = value
    this.in0 = new Port({
      position: new DOMPoint(0, 0),
      clearValue,
    })
    this.in1 = new Port({
      position: new DOMPoint(0, 2),
      clearValue,
    })
    this.out = new Port({
      position: new DOMPoint(2, 1),
      clearValue,
    })
    this.addPort(this.in0)
    this.addPort(this.in1)
    this.addPort(this.out)
  }

  update() {
    super.update()

    if (this.in0.isClear() || this.in1.isClear()) {
      this.in0.read()
      this.in1.read()
      this.out.write(this.value)
    } else {
      this.out.clear()
    }
  }

  drawBackground(args: DrawArgs): void {
    super.drawBackground(args)

    const context = args.context
    const bounds = this.absolutePixelBounds

    context.fillStyle = 'white'
    context.textAlign = 'center'
    context.font = '18px monospace'
    context.fillText(
      'NAND',
      bounds.x + bounds.width / 2 - 14,
      bounds.y + bounds.height / 2 + 5
    )
  }
}
