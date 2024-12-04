import Circuit from '../Circuit.js';
import Port from '../Port.js';
export default class Microcontroller extends Circuit {
    p0;
    p1;
    p2;
    p3;
    registers;
    stack;
    constructor(x, y, stack) {
        super({
            bounds: new DOMRect(x, y, 10, 10),
        });
        this.p0 = new Port({
            position: new DOMPoint(0, 0),
            access: ['read', 'receive', 'send'],
        });
        this.p1 = new Port({
            position: new DOMPoint(0, 9),
            access: ['read', 'receive', 'send'],
        });
        this.p2 = new Port({
            position: new DOMPoint(9, 0),
            access: ['read', 'receive', 'send'],
        });
        this.p3 = new Port({
            position: new DOMPoint(9, 9),
            access: ['read', 'receive', 'send'],
        });
        this.registers = {
            acc: 0,
            isp: 0,
            flg: 0,
            slp: 0,
        };
        this.stack = stack ?? [];
        this.addPort(this.p0);
        this.addPort(this.p1);
        this.addPort(this.p2);
        this.addPort(this.p3);
    }
    get zeroFlag() {
        return (this.registers.flg & 1) === 1;
    }
    set zeroFlag(value) {
        if (value) {
            this.registers.flg |= 1;
        }
        else {
            this.registers.flg &= ~1;
        }
    }
    get signFlag() {
        return (this.registers.flg & 2) === 2;
    }
    set signFlag(value) {
        if (value) {
            this.registers.flg |= 2;
        }
        else {
            this.registers.flg &= ~2;
        }
    }
    advance() {
        this.registers.isp++;
        if (this.registers.isp >= this.stack.length) {
            this.registers.isp = 0;
        }
    }
    getLabelStackIndex(label) {
        const index = this.stack.findIndex((item) => item.label === label);
        if (index === -1) {
            throw new Error(`Label ${label} not found in stack`);
        }
        return index;
    }
    tick() {
        super.tick();
        if (this.registers.slp > 0) {
            this.registers.slp--;
            if (this.registers.slp === 0) {
                this.advance();
            }
            return;
        }
        if (this.stack.length === 0) {
            return;
        }
        if (this.registers.isp >= this.stack.length) {
            this.registers.isp = 0;
        }
        const { command, args } = this.stack[this.registers.isp];
        const ports = {
            p0: this.p0,
            p1: this.p1,
            p2: this.p2,
            p3: this.p3,
        };
        const getArg = (index) => {
            if (index >= args.length) {
                throw new Error(`Missing argument ${index} for command ${command} at stack item ${this.registers.isp}`);
            }
            const value = args[index] in this.registers
                ? this.registers[args[index]]
                : args[index] in ports
                    ? ports[args[index]].read()
                    : args[index];
            return parseInt(String(value));
        };
        switch (command) {
            case 'nop':
                this.registers.isp++;
                break;
            case 'mov':
                if (!args[0] || !args[1]) {
                    throw new Error(`Missing arguments for command ${command}`);
                }
                const value = getArg(0);
                const target = args[1];
                if (target in this.registers) {
                    // Write to register
                    this.registers[target] = value;
                }
                else if (target in ports) {
                    // Write to port
                    ports[target].send(value);
                }
                else {
                    throw new Error(`Target ${target} is not a register or port`);
                }
                this.advance();
                break;
            case 'add':
                this.registers.acc += getArg(0);
                this.advance();
                break;
            case 'mul':
                this.registers.acc *= getArg(0);
                this.advance();
                break;
            case 'sub':
                this.registers.acc -= getArg(0);
                this.registers.isp++;
                break;
            case 'div':
                this.registers.acc /= getArg(0);
                this.advance();
                break;
            case 'mod':
                this.registers.acc %= getArg(0);
                this.advance();
                break;
            case 'cmp':
                const delta = getArg(0) - getArg(1);
                this.zeroFlag = delta === 0;
                this.signFlag = delta < 0;
                this.advance();
                break;
            case 'jmp':
                if (!args[0]) {
                    throw new Error(`Missing argument 0 for command ${command}`);
                }
                this.registers.isp = this.getLabelStackIndex(args[0]);
                break;
            case 'je':
                if (!args[0]) {
                    throw new Error(`Missing argument 0 for command ${command}`);
                }
                if (this.zeroFlag) {
                    this.registers.isp = this.getLabelStackIndex(args[0]);
                }
                else {
                    this.advance();
                }
                break;
            case 'jne':
                if (!args[0]) {
                    throw new Error(`Missing argument 0 for command ${command}`);
                }
                if (!this.zeroFlag) {
                    this.registers.isp = this.getLabelStackIndex(args[0]);
                }
                else {
                    this.advance();
                }
                break;
            case 'jg':
                if (!args[0]) {
                    throw new Error(`Missing argument 0 for command ${command}`);
                }
                if (!this.zeroFlag && !this.signFlag) {
                    this.registers.isp = this.getLabelStackIndex(args[0]);
                }
                else {
                    this.advance();
                }
                break;
            case 'jge':
                if (!args[0]) {
                    throw new Error(`Missing argument 0 for command ${command}`);
                }
                if (this.zeroFlag || !this.signFlag) {
                    this.registers.isp = this.getLabelStackIndex(args[0]);
                }
                else {
                    this.advance();
                }
                break;
            case 'jl':
                if (!args[0]) {
                    throw new Error(`Missing argument 0 for command ${command}`);
                }
                if (!this.zeroFlag && this.signFlag) {
                    this.registers.isp = this.getLabelStackIndex(args[0]);
                }
                else {
                    this.advance();
                }
                break;
            case 'jle':
                if (!args[0]) {
                    throw new Error(`Missing argument 0 for command ${command}`);
                }
                if (this.zeroFlag || this.signFlag) {
                    this.registers.isp = this.getLabelStackIndex(args[0]);
                }
                else {
                    this.advance();
                }
                break;
            case 'slp':
                if (!args[0]) {
                    throw new Error(`Missing argument 0 for command ${command}`);
                }
                this.registers.slp = getArg(0);
                break;
            case 'slx':
                if (!args[0]) {
                    throw new Error(`Missing argument 0 for command ${command}`);
                }
                if (!(args[0] in ports)) {
                    throw new Error(`Port ${args[0]} not found`);
                }
                const port = ports[args[0]];
                if (port.dataAvailable) {
                    this.advance();
                }
                break;
        }
    }
    draw(args) {
        super.draw(args);
        const context = args.context;
        const bounds = this.absolutePixelBounds;
        const codeLines = this.stack.map((item, index) => {
            const label = item.label ? `${item.label}: ` : '';
            return `${label}${item.command} ${item.args.join(' ')}`;
        });
        // Draw code
        context.font = '12px monospace';
        codeLines.forEach((line, index) => {
            context.fillStyle = index === this.registers.isp ? 'lime' : 'white';
            context.fillText(line, bounds.x + 2 * this.gridSize, bounds.y + this.gridSize + index * 12);
        });
        // Draw registers
        context.fillStyle = 'white';
        context.fillText(`acc: ${this.registers.acc}`, bounds.x + 6 * this.gridSize, bounds.y + this.gridSize + 12);
        context.fillText(`isp: ${this.registers.isp}`, bounds.x + 6 * this.gridSize, bounds.y + this.gridSize + 24);
        const flags = ['Z', 'S']
            .map((flag, index) => (this.registers.flg & Math.pow(2, index)) === Math.pow(2, index)
            ? flag
            : '-')
            .join('');
        context.fillText(`flg: ${flags}`, bounds.x + 6 * this.gridSize, bounds.y + this.gridSize + 36);
        context.fillText(`slp: ${this.registers.slp}`, bounds.x + 6 * this.gridSize, bounds.y + this.gridSize + 48);
        // Draw port names next to ports
        context.fillStyle = 'white';
        context.fillText('p0', bounds.x + this.gridSize + 2, bounds.y + this.gridSize - 14);
        context.fillText('p1', bounds.x + this.gridSize + 2, bounds.y + this.gridSize + 9 * this.gridSize - 14);
        context.fillText('p2', bounds.x + 9 * this.gridSize - 16, bounds.y + this.gridSize - 14);
        context.fillText('p3', bounds.x + 9 * this.gridSize - 16, bounds.y + this.gridSize + 9 * this.gridSize - 14);
    }
}
