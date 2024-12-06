import Circuit from '../../Circuit.js'
import Port from '../../Port.js'
import { DrawArgs } from '../../utils.js'

export default class NotGate<Value> extends Circuit {
  readonly value: Value;
  readonly in: Port<Value>
  readonly out: Port<Value>

  constructor(x: number, y: number, value: Value, clearValue: Value) {
    super({
      bounds: new DOMRect(x, y, 3, 1),
    })

    this.value = value
    this.in = new Port({
      position: new DOMPoint(0, 0),
      clearValue,
    })
    this.out = new Port({
      position: new DOMPoint(2, 0),
      clearValue,
    })
    this.addPorts([this.in, this.out])
  }

  update() {
    super.update()

    if (this.in.isClear()) {
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
      'NOT',
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2 + 5
    )
  }
}
