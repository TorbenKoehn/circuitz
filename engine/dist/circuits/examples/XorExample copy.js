import Circuit from '../../Circuit.js';
import Receiver from '../Receiver.js';
import Sender from '../Sender.js';
import CompoundXorGate from '../logic-gates/CompoundXorGate.js';
export default class XorExample extends Circuit {
    in;
    xorNeither;
    xorIn1;
    xorIn2;
    xorBoth;
    out0;
    out1;
    out2;
    out3;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 19, 31),
        });
        this.in = new Sender(0, 15, 1);
        this.xorNeither = new CompoundXorGate(2, 0, 1);
        this.xorIn1 = new CompoundXorGate(2, 8, 1);
        this.xorIn2 = new CompoundXorGate(2, 16, 1);
        this.xorBoth = new CompoundXorGate(2, 24, 1);
        this.out0 = new Receiver(18, 3);
        this.out1 = new Receiver(18, 11);
        this.out2 = new Receiver(18, 19);
        this.out3 = new Receiver(18, 27);
        this.addChild(this.in);
        this.addChild(this.xorNeither);
        this.addChild(this.xorIn1);
        this.addChild(this.xorIn2);
        this.addChild(this.xorBoth);
        this.addChild(this.out0);
        this.addChild(this.out1);
        this.addChild(this.out2);
        this.addChild(this.out3);
        this.in.p0.connect(this.xorIn1.in0);
        this.in.p0.connect(this.xorIn2.in1);
        this.in.p0.connect(this.xorBoth.in0);
        this.in.p0.connect(this.xorBoth.in1);
        this.xorNeither.out.connect(this.out0.p0);
        this.xorIn1.out.connect(this.out1.p0);
        this.xorIn2.out.connect(this.out2.p0);
        this.xorBoth.out.connect(this.out3.p0);
    }
    drawBackground(args) {
        super.drawBackground(args);
        const context = args.context;
        const position = args.bounds;
        const bounds = new DOMRect(position.x * args.gridSize, position.y * args.gridSize, this.bounds.width * args.gridSize, this.bounds.height * args.gridSize);
        context.fillStyle = '#666';
        context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
}
