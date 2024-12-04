import Circuit from '../Circuit.js';
import Port from '../Port.js';
import NandGate from './NandGate.js';
export default class CompoundXnorGate extends Circuit {
    value;
    in1;
    in2;
    nand1;
    nand2;
    nand3;
    nand4;
    out;
    constructor(x, y, value) {
        super({
            bounds: new DOMRect(x, y, 15, 7),
        });
        this.value = value;
        this.in1 = new Port({
            position: new DOMPoint(0, 1),
            access: ['read', 'receive', 'send'],
        });
        this.in2 = new Port({
            position: new DOMPoint(0, 5),
            access: ['read', 'receive', 'send'],
        });
        this.nand1 = new NandGate(2, 2, 1);
        this.nand2 = new NandGate(6, 0, 1);
        this.nand3 = new NandGate(6, 4, 1);
        this.nand4 = new NandGate(10, 2, value);
        this.out = new Port({
            position: new DOMPoint(14, 3),
            access: ['read', 'receive', 'send'],
        });
        this.addPort(this.in1);
        this.addPort(this.in2);
        this.addPort(this.out);
        this.addChild(this.nand1);
        this.addChild(this.nand2);
        this.addChild(this.nand3);
        this.addChild(this.nand4);
        this.in1.connect(this.nand1.in1);
        this.in1.connect(this.nand2.in1);
        this.in2.connect(this.nand1.in2);
        this.in2.connect(this.nand3.in2);
        this.nand1.out.connect(this.nand2.in2);
        this.nand1.out.connect(this.nand3.in1);
        this.nand2.out.connect(this.nand4.in1);
        this.nand3.out.connect(this.nand4.in2);
        this.nand4.out.connect(this.out);
    }
    drawBackground(args) {
        super.drawBackground(args);
        const context = args.context;
        const position = args.bounds;
        const bounds = new DOMRect(position.x * args.gridSize, position.y * args.gridSize, this.bounds.width * args.gridSize, this.bounds.height * args.gridSize);
        context.fillStyle = '#555';
        context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
}
