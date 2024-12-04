import Circuit from '../../Circuit.js';
import Sender from '../Sender.js';
import CompoundNorGate from '../CompoundNorGate.js';
export default class NorExample extends Circuit {
    in;
    norNeither;
    norIn1;
    norIn2;
    norBoth;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 40, 33),
        });
        this.in = new Sender(1, 10, 1);
        this.norNeither = new CompoundNorGate(10, 1, 1);
        this.norIn1 = new CompoundNorGate(10, 9, 1);
        this.norIn2 = new CompoundNorGate(10, 17, 1);
        this.norBoth = new CompoundNorGate(10, 25, 1);
        this.addChild(this.in);
        this.addChild(this.norNeither);
        this.addChild(this.norIn1);
        this.addChild(this.norIn2);
        this.addChild(this.norBoth);
        this.in.p0.connect(this.norIn1.in1);
        this.in.p0.connect(this.norIn2.in2);
        this.in.p0.connect(this.norBoth.in1);
        this.in.p0.connect(this.norBoth.in2);
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
