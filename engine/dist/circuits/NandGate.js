import Circuit from '../Circuit.js';
import Port from '../Port.js';
export default class NandGate extends Circuit {
    value;
    in0;
    in1;
    out;
    constructor(x, y, value) {
        super({
            bounds: new DOMRect(x, y, 3, 3),
        });
        this.value = value;
        this.in0 = new Port({
            position: new DOMPoint(0, 0),
            access: ['receive'],
            lifeTime: 100,
        });
        this.in1 = new Port({
            position: new DOMPoint(0, 2),
            access: ['receive'],
            lifeTime: 100,
        });
        this.out = new Port({
            position: new DOMPoint(2, 1),
            access: ['send'],
        });
        this.addPort(this.in0);
        this.addPort(this.in1);
        this.addPort(this.out);
    }
    tick() {
        super.tick();
        if (!(this.in0.dataAvailable && this.in1.dataAvailable)) {
            this.out.send(this.value);
        }
    }
    drawBackground(args) {
        super.drawBackground(args);
        const context = args.context;
        const position = args.bounds;
        const bounds = new DOMRect(position.x * args.gridSize, position.y * args.gridSize, this.bounds.width * args.gridSize, this.bounds.height * args.gridSize);
        context.fillStyle = 'white';
        context.fillText('NAND', bounds.x + bounds.width / 2 - 20, bounds.y + bounds.height / 2 + 5);
    }
}
