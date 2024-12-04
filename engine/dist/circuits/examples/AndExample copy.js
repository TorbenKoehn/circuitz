import Circuit from '../../Circuit.js';
import Sender from '../Sender.js';
import CompoundAndGate from '../CompoundAndGate.js';
export default class AndExample extends Circuit {
    in;
    andNeither;
    andIn1;
    andIn2;
    andBoth;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 40, 20),
        });
        this.in = new Sender(1, 10, 1);
        this.andNeither = new CompoundAndGate(10, 1, 1);
        this.andIn1 = new CompoundAndGate(10, 5, 1);
        this.andIn2 = new CompoundAndGate(10, 9, 1);
        this.andBoth = new CompoundAndGate(10, 13, 1);
        this.addChild(this.in);
        this.addChild(this.andNeither);
        this.addChild(this.andIn1);
        this.addChild(this.andIn2);
        this.addChild(this.andBoth);
        this.in.p0.connect(this.andIn1.in1);
        this.in.p0.connect(this.andIn2.in2);
        this.in.p0.connect(this.andBoth.in1);
        this.in.p0.connect(this.andBoth.in2);
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
