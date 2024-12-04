import Circuit from '../Circuit.js';
import Port from '../Port.js';
import NandGate from './NandGate.js';
export default class NotGate extends Circuit {
    value;
    in;
    nand;
    out;
    constructor(x, y, value) {
        super({
            bounds: new DOMRect(x, y, 7, 3),
        });
        this.value = value;
        this.in = new Port({
            position: new DOMPoint(0, 1),
            access: ['read', 'receive', 'send'],
            lifeTime: 100,
        });
        this.nand = new NandGate(2, 0, value);
        this.out = new Port({
            position: new DOMPoint(6, 1),
            access: ['read', 'receive', 'send'],
            lifeTime: 100,
        });
        this.addPort(this.in);
        this.addPort(this.out);
        this.addChild(this.nand);
        this.in.connect(this.nand.in1);
        this.in.connect(this.nand.in2);
        this.nand.out.connect(this.out);
    }
    tick() {
        super.tick();
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
