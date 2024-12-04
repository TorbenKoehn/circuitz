import Circuit from '../../Circuit.js';
import Sender from '../Sender.js';
import CompoundOrGate from '../CompoundOrGate.js';
export default class OrExample extends Circuit {
    in;
    orNeither;
    orIn1;
    orIn2;
    orBoth;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 40, 33),
        });
        this.in = new Sender(1, 10, 1);
        this.orNeither = new CompoundOrGate(10, 1, 1);
        this.orIn1 = new CompoundOrGate(10, 9, 1);
        this.orIn2 = new CompoundOrGate(10, 17, 1);
        this.orBoth = new CompoundOrGate(10, 25, 1);
        this.addChild(this.in);
        this.addChild(this.orNeither);
        this.addChild(this.orIn1);
        this.addChild(this.orIn2);
        this.addChild(this.orBoth);
        this.in.p0.connect(this.orIn1.in1);
        this.in.p0.connect(this.orIn2.in2);
        this.in.p0.connect(this.orBoth.in1);
        this.in.p0.connect(this.orBoth.in2);
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
