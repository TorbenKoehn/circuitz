import Circuit from '../../Circuit.js';
import Sender from '../Sender.js';
import NandGate from '../NandGate.js';
export default class NandExample extends Circuit {
    in;
    nandNeither;
    nandIn1;
    nandIn2;
    nandBoth;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 40, 20),
        });
        this.in = new Sender(1, 10, 1);
        this.nandNeither = new NandGate(10, 1, 1);
        this.nandIn1 = new NandGate(10, 5, 1);
        this.nandIn2 = new NandGate(10, 9, 1);
        this.nandBoth = new NandGate(10, 13, 1);
        this.addChild(this.in);
        this.addChild(this.nandNeither);
        this.addChild(this.nandIn1);
        this.addChild(this.nandIn2);
        this.addChild(this.nandBoth);
        this.in.p0.connect(this.nandIn1.in1);
        this.in.p0.connect(this.nandIn2.in2);
        this.in.p0.connect(this.nandBoth.in1);
        this.in.p0.connect(this.nandBoth.in2);
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
