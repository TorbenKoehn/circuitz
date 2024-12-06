import Circuit from '../Circuit.js'
import Port from '../Port.js'
import { DrawArgs } from '../utils.js'

export type MicrocontrollerInit = {
  readonly position: DOMPoint
  readonly stack?: Instruction[]
  readonly tickInterval?: number
}

export type Instruction = {
  label?: string
  command: string
  args: string[]
}

export default class Microcontroller extends Circuit {
  readonly p0: Port<number>
  readonly p1: Port<number>
  readonly p2: Port<number>
  readonly p3: Port<number>

  readonly registers: {
    acc: number
    isp: number
    flg: number
    slp: number
  }

  readonly latches: {
    in: {
      p0: number
      p1: number
      p2: number
      p3: number
    }
    out: {
      p0: number
      p1: number
      p2: number
      p3: number
    }
  }

  readonly stack: Instruction[]

  constructor(init: MicrocontrollerInit) {
    super({
      bounds: new DOMRect(init.position.x, init.position.y, 10, 10),
    })

    this.p0 = new Port({
      position: new DOMPoint(0, 0),
      clearValue: 0,
    })
    this.p1 = new Port({
      position: new DOMPoint(0, 9),
      clearValue: 0,
    })
    this.p2 = new Port({
      position: new DOMPoint(9, 0),
      clearValue: 0,
    })
    this.p3 = new Port({
      position: new DOMPoint(9, 9),
      clearValue: 0,
    })

    this.registers = {
      acc: 0,
      isp: 0,
      flg: 0,
      slp: 0,
    }

    this.latches = {
      in: {
        p0: 0,
        p1: 0,
        p2: 0,
        p3: 0,
      },
      out: {
        p0: 0,
        p1: 0,
        p2: 0,
        p3: 0,
      },
    }

    this.stack = init.stack ?? []

    this.addPorts([this.p0, this.p1, this.p2, this.p3])
  }

  get zeroFlag() {
    return (this.registers.flg & 1) === 1
  }

  set zeroFlag(value: boolean) {
    if (value) {
      this.registers.flg |= 1
    } else {
      this.registers.flg &= ~1
    }
  }

  get signFlag() {
    return (this.registers.flg & 2) === 2
  }

  set signFlag(value: boolean) {
    if (value) {
      this.registers.flg |= 2
    } else {
      this.registers.flg &= ~2
    }
  }

  advance() {
    this.registers.isp++

    if (this.registers.isp >= this.stack.length) {
      this.registers.isp = 0
    }
  }

  getLabelStackIndex(label: string) {
    const index = this.stack.findIndex((item) => item.label === label)

    if (index === -1) {
      throw new Error(`Label ${label} not found in stack`)
    }

    return index
  }

  tick() {
    super.tick()

    if (this.registers.slp > 0) {
      this.registers.slp--

      if (this.registers.slp === 0) {
        this.advance()
      }
      return
    }

    if (this.stack.length === 0) {
      return
    }

    if (this.registers.isp >= this.stack.length) {
      this.registers.isp = 0
    }

    const { command, args } = this.stack[this.registers.isp]

    const readArg = (index: number) => {
      if (index >= args.length) {
        throw new Error(
          `Missing argument ${index} for command ${command} at stack item ${this.registers.isp}`
        )
      }

      const value =
        args[index] in this.registers
          ? this.registers[args[index] as keyof typeof this.registers]
          : args[index] in this.latches.in
          ? this.latches.in[args[index] as keyof typeof this.latches.in]
          : args[index]
      return parseInt(String(value))
    }

    switch (command) {
      case 'nop':
        this.registers.isp++
        break
      case 'mov':
        if (!args[0] || !args[1]) {
          throw new Error(`Missing arguments for command ${command}`)
        }

        const value = readArg(0)
        const target = args[1]

        if (target in this.registers) {
          // Write to register
          this.registers[target as keyof typeof this.registers] = value
        } else if (target in this.latches.out) {
          // Write to latch
          this.latches.out[target as keyof typeof this.latches.out] = value
        } else {
          throw new Error(`Target ${target} is not a register or port`)
        }
        this.advance()
        break
      case 'add':
        this.registers.acc += readArg(0)
        this.advance()
        break
      case 'mul':
        this.registers.acc *= readArg(0)
        this.advance()
        break
      case 'sub':
        this.registers.acc -= readArg(0)
        this.registers.isp++
        break
      case 'div':
        this.registers.acc /= readArg(0)
        this.advance()
        break
      case 'mod':
        this.registers.acc %= readArg(0)
        this.advance()
        break
      case 'cmp':
        const delta = readArg(0) - readArg(1)
        this.zeroFlag = delta === 0
        this.signFlag = delta < 0
        this.advance()
        break
      case 'jmp':
        if (!args[0]) {
          throw new Error(`Missing argument 0 for command ${command}`)
        }

        this.registers.isp = this.getLabelStackIndex(args[0])
        break
      case 'je':
        if (!args[0]) {
          throw new Error(`Missing argument 0 for command ${command}`)
        }

        if (this.zeroFlag) {
          this.registers.isp = this.getLabelStackIndex(args[0])
        } else {
          this.advance()
        }
        break
      case 'jne':
        if (!args[0]) {
          throw new Error(`Missing argument 0 for command ${command}`)
        }

        if (!this.zeroFlag) {
          this.registers.isp = this.getLabelStackIndex(args[0])
        } else {
          this.advance()
        }
        break
      case 'jg':
        if (!args[0]) {
          throw new Error(`Missing argument 0 for command ${command}`)
        }

        if (!this.zeroFlag && !this.signFlag) {
          this.registers.isp = this.getLabelStackIndex(args[0])
        } else {
          this.advance()
        }
        break
      case 'jge':
        if (!args[0]) {
          throw new Error(`Missing argument 0 for command ${command}`)
        }

        if (this.zeroFlag || !this.signFlag) {
          this.registers.isp = this.getLabelStackIndex(args[0])
        } else {
          this.advance()
        }
        break
      case 'jl':
        if (!args[0]) {
          throw new Error(`Missing argument 0 for command ${command}`)
        }

        if (!this.zeroFlag && this.signFlag) {
          this.registers.isp = this.getLabelStackIndex(args[0])
        } else {
          this.advance()
        }
        break
      case 'jle':
        if (!args[0]) {
          throw new Error(`Missing argument 0 for command ${command}`)
        }

        if (this.zeroFlag || this.signFlag) {
          this.registers.isp = this.getLabelStackIndex(args[0])
        } else {
          this.advance()
        }
        break
      case 'slp':
        if (!args[0]) {
          throw new Error(`Missing argument 0 for command ${command}`)
        }

        this.registers.slp = readArg(0)
        break
      case 'rs':
        this.registers.acc = 0
        this.registers.flg = 0
        this.registers.isp = 0
        this.registers.slp = 0
        this.latches.in.p0 = 0
        this.latches.in.p1 = 0
        this.latches.in.p2 = 0
        this.latches.in.p3 = 0
        this.latches.out.p0 = 0
        this.latches.out.p1 = 0
        this.latches.out.p2 = 0
        this.latches.out.p3 = 0
        this.advance()
        break
      case 'rsr':
        this.registers.acc = 0
        this.registers.flg = 0
        this.registers.isp = 0
        this.registers.slp = 0
        this.advance()
        break
      case 'rsp':
        this.latches.in.p0 = 0
        this.latches.in.p1 = 0
        this.latches.in.p2 = 0
        this.latches.in.p3 = 0
        this.latches.out.p0 = 0
        this.latches.out.p1 = 0
        this.latches.out.p2 = 0
        this.latches.out.p3 = 0
        this.advance()
        break
      default:
        throw new Error(`Unknown command ${command}`)
    }
  }

  update(): void {
    super.update()

    if (!this.p0.isClear()) {
      this.latches.in.p0 = this.p0.read()
    }

    if (this.latches.out.p0 !== this.p0.clearValue) {
      this.p0.write(this.latches.out.p0)
    }

    if (!this.p1.isClear()) {
      this.latches.in.p1 = this.p1.read()
    }

    if (this.latches.out.p1 !== this.p1.clearValue) {
      this.p1.write(this.latches.out.p1)
    }

    if (!this.p2.isClear()) {
      this.latches.in.p2 = this.p2.read()
    }

    if (this.latches.out.p2 !== this.p2.clearValue) {
      this.p2.write(this.latches.out.p2)
    }

    if (!this.p3.isClear()) {
      this.latches.in.p3 = this.p3.read()
    }

    if (this.latches.out.p3 !== this.p3.clearValue) {
      this.p3.write(this.latches.out.p3)
    }
  }

  draw(args: DrawArgs): void {
    super.draw(args)

    const context = args.context
    const bounds = this.absolutePixelBounds

    const codeLines = this.stack.map((item, index) => {
      const label = item.label ? `${item.label}: ` : ''
      return `${label}${item.command} ${item.args.join(' ')}`
    })

    // Draw code
    context.textAlign = 'left'
    context.font = '12px monospace'
    codeLines.forEach((line, index) => {
      context.fillStyle = index === this.registers.isp ? 'lime' : 'white'
      context.fillText(
        line,
        bounds.x + 2 * this.gridSize,
        bounds.y + this.gridSize + index * 12
      )
    })

    // Draw registers
    context.fillStyle = 'white'
    context.fillText(
      `acc: ${this.registers.acc}`,
      bounds.x + 6 * this.gridSize,
      bounds.y + this.gridSize + 12
    )
    context.fillText(
      `isp: ${this.registers.isp}`,
      bounds.x + 6 * this.gridSize,
      bounds.y + this.gridSize + 24
    )
    const flags = ['Z', 'S']
      .map((flag, index) =>
        (this.registers.flg & Math.pow(2, index)) === Math.pow(2, index)
          ? flag
          : '-'
      )
      .join('')
    context.fillText(
      `flg: ${flags}`,
      bounds.x + 6 * this.gridSize,
      bounds.y + this.gridSize + 36
    )
    context.fillText(
      `slp: ${this.registers.slp}`,
      bounds.x + 6 * this.gridSize,
      bounds.y + this.gridSize + 48
    )
    context.fillText(
      `p0: I:${this.latches.in.p0} O:${this.latches.out.p0}`,
      bounds.x + 6 * this.gridSize,
      bounds.y + this.gridSize + 60
    )
    context.fillText(
      `p1: I:${this.latches.in.p1} O:${this.latches.out.p1}`,
      bounds.x + 6 * this.gridSize,
      bounds.y + this.gridSize + 72
    )
    context.fillText(
      `p2: I:${this.latches.in.p2} O:${this.latches.out.p2}`,
      bounds.x + 6 * this.gridSize,
      bounds.y + this.gridSize + 84
    )
    context.fillText(
      `p3: I:${this.latches.in.p3} O:${this.latches.out.p3}`,
      bounds.x + 6 * this.gridSize,
      bounds.y + this.gridSize + 96
    )

    // Draw port names next to ports
    context.fillStyle = 'white'
    context.fillText(
      'p0',
      bounds.x + this.gridSize + 2,
      bounds.y + this.gridSize - 14
    )
    context.fillText(
      'p1',
      bounds.x + this.gridSize + 2,
      bounds.y + this.gridSize + 9 * this.gridSize - 14
    )
    context.fillText(
      'p2',
      bounds.x + 9 * this.gridSize - 16,
      bounds.y + this.gridSize - 14
    )
    context.fillText(
      'p3',
      bounds.x + 9 * this.gridSize - 16,
      bounds.y + this.gridSize + 9 * this.gridSize - 14
    )
  }
}
