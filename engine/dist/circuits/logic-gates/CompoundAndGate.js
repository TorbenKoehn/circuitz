import Circuit from '../../Circuit.js';
import Port from '../../Port.js';
import NandGate from './NandGate.js';
export default class CompoundAndGate extends Circuit {
    value;
    in0;
    in1;
    nand0;
    nand1;
    out;
    constructor(x, y, value) {
        super({
            bounds: new DOMRect(x, y, 11, 3),
            backgroundColor: '#555',
        });
        this.value = value;
        this.in0 = new Port({
            position: new DOMPoint(0, 0),
            access: ['receive', 'send'],
            lifeTime: 200,
        });
        this.in1 = new Port({
            position: new DOMPoint(0, 2),
            access: ['receive', 'send'],
            lifeTime: 200,
        });
        this.nand0 = new NandGate(2, 0, 1);
        this.nand1 = new NandGate(6, 0, value);
        this.out = new Port({
            position: new DOMPoint(10, 1),
            access: ['receive', 'send'],
            lifeTime: 200,
        });
        this.addPort(this.in0);
        this.addPort(this.in1);
        this.addPort(this.out);
        this.addChild(this.nand0);
        this.addChild(this.nand1);
        this.in0.connect(this.nand0.in0);
        this.in1.connect(this.nand0.in1);
        this.nand0.out.connect(this.nand1.in0);
        this.nand0.out.connect(this.nand1.in1);
        this.nand1.out.connect(this.out);
    }
}