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
    constructor(x, y, value, clearValue) {
        super({
            bounds: new DOMRect(x, y, 11, 3),
            backgroundColor: '#555',
        });
        this.value = value;
        this.in0 = new Port({
            position: new DOMPoint(0, 0),
            clearValue,
        });
        this.in1 = new Port({
            position: new DOMPoint(0, 2),
            clearValue,
        });
        this.nand0 = new NandGate(2, 0, value, clearValue);
        this.nand1 = new NandGate(6, 0, value, clearValue);
        this.out = new Port({
            position: new DOMPoint(10, 1),
            clearValue,
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
