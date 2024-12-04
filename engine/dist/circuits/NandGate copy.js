import Circuit from '../Circuit.js';
import Port from '../Port.js';
export default class NandGate extends Circuit {
    value;
    in1;
    in2;
    out;
    constructor(x, y, value) {
        super({
            bounds: new DOMRect(x, y, 3, 3),
        });
        this.value = value;
        this.in1 = new Port({
            position: new DOMPoint(0, 0),
            access: ['read', 'receive'],
        });
        this.in2 = new Port({
            position: new DOMPoint(0, 2),
            access: ['read', 'receive'],
        });
        this.out = new Port({
            position: new DOMPoint(2, 1),
            access: ['send'],
        });
        this.addPort(this.in1);
        this.addPort(this.in2);
        this.addPort(this.out);
    }
    tick() {
        super.tick();
        if (!(this.in1.dataAvailable && this.in2.dataAvailable)) {
            this.out.send(this.value);
        }
    }
}
