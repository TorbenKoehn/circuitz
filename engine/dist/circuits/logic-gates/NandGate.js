import Circuit from '../../Circuit.js';
import Port from '../../Port.js';
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
            lifeTime: 200,
        });
        this.in1 = new Port({
            position: new DOMPoint(0, 2),
            access: ['receive'],
            lifeTime: 200,
        });
        this.out = new Port({
            position: new DOMPoint(2, 1),
            access: ['send'],
            lifeTime: 200,
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
        const bounds = this.absolutePixelBounds;
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.font = '18px monospace';
        context.fillText('NAND', bounds.x + bounds.width / 2 - 14, bounds.y + bounds.height / 2 + 5);
    }
}