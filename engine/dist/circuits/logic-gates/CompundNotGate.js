import Circuit from '../../Circuit.js';
import Port from '../../Port.js';
import NandGate from './NandGate.js';
export default class CompoundNotGate extends Circuit {
    value;
    in;
    nand;
    out;
    constructor(x, y, value) {
        super({
            bounds: new DOMRect(x, y, 7, 3),
            backgroundColor: '#555',
        });
        this.value = value;
        this.in = new Port({
            position: new DOMPoint(0, 1),
            access: ['receive', 'send'],
            lifeTime: 200,
        });
        this.nand = new NandGate(2, 0, value);
        this.out = new Port({
            position: new DOMPoint(6, 1),
            access: ['receive', 'send'],
            lifeTime: 200,
        });
        this.addPort(this.in);
        this.addPort(this.out);
        this.addChild(this.nand);
        this.in.connect(this.nand.in0);
        this.in.connect(this.nand.in1);
        this.nand.out.connect(this.out);
    }
    tick() {
        super.tick();
    }
}