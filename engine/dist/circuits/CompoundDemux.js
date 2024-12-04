import Circuit from '../Circuit.js';
import Port from '../Port.js';
import NandGate from './NandGate.js';
import Repeater from './Repeater.js';
export default class CompoundDemux extends Circuit {
    value;
    in;
    inRepeat0;
    inRepeat1;
    select;
    selectRepeat0;
    selectRepeat1;
    nand0;
    nand1;
    nand2;
    nand3;
    nand4;
    out0;
    out1;
    constructor(x, y, value) {
        super({
            bounds: new DOMRect(x, y, 19, 9),
        });
        this.value = value;
        this.in = new Port({
            position: new DOMPoint(0, 0),
            access: ['receive', 'send'],
        });
        this.inRepeat0 = new Repeater(2, 0, 1);
        this.inRepeat1 = new Repeater(2, 8, 1);
        this.select = new Port({
            position: new DOMPoint(0, 3),
            access: ['receive', 'send'],
        });
        this.selectRepeat0 = new Repeater(4, 3, 1);
        this.selectRepeat1 = new Repeater(4, 6, 1);
        this.nand0 = new NandGate(6, 2, 1);
        this.nand1 = new NandGate(6, 6, 1);
        this.nand2 = new NandGate(10, 0, 1);
        this.nand3 = new NandGate(10, 6, value);
        this.nand4 = new NandGate(14, 0, value);
        this.out0 = new Port({
            position: new DOMPoint(18, 1),
            access: ['receive', 'send'],
        });
        this.out1 = new Port({
            position: new DOMPoint(18, 7),
            access: ['receive', 'send'],
        });
        this.addPort(this.in);
        this.addPort(this.select);
        this.addPort(this.out0);
        this.addPort(this.out1);
        this.addChild(this.inRepeat0);
        this.addChild(this.inRepeat1);
        this.addChild(this.selectRepeat0);
        this.addChild(this.selectRepeat1);
        this.addChild(this.nand0);
        this.addChild(this.nand1);
        this.addChild(this.nand2);
        this.addChild(this.nand3);
        this.addChild(this.nand4);
        this.in.connect(this.inRepeat0.p0);
        this.inRepeat0.p0.connect(this.nand2.in0);
        this.inRepeat0.p0.connect(this.inRepeat1.p0);
        this.inRepeat1.p0.connect(this.nand1.in1);
        this.select.connect(this.selectRepeat0.p0);
        this.selectRepeat0.p0.connect(this.nand0.in0);
        this.selectRepeat0.p0.connect(this.nand0.in1);
        this.selectRepeat0.p0.connect(this.selectRepeat1.p0);
        this.selectRepeat1.p0.connect(this.nand1.in0);
        this.nand0.out.connect(this.nand2.in1);
        this.nand1.out.connect(this.nand3.in0);
        this.nand1.out.connect(this.nand3.in1);
        this.nand2.out.connect(this.nand4.in0);
        this.nand2.out.connect(this.nand4.in1);
        this.nand4.out.connect(this.out0);
        this.nand3.out.connect(this.out1);
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
