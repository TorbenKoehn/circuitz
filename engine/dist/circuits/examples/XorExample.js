import Circuit from '../../Circuit.js';
import Receiver from '../Receiver.js';
import Sender from '../Sender.js';
import CompoundXorGate from '../logic-gates/CompoundXorGate.js';
export default class XorExample extends Circuit {
    in0;
    in1;
    xorGate;
    out;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 21, 9),
            backgroundColor: '#666',
        });
        this.in0 = new Sender({
            position: new DOMPoint(1, 2),
            value: 1,
            clearValue: 0,
            keyboardKey: 'KeyA',
        });
        this.in1 = new Sender({
            position: new DOMPoint(1, 6),
            value: 1,
            clearValue: 0,
            keyboardKey: 'KeyB',
        });
        this.xorGate = new CompoundXorGate(3, 1, 1, 0);
        this.out = new Receiver({ position: new DOMPoint(19, 4), clearValue: 0 });
        this.addChild(this.in0);
        this.addChild(this.in1);
        this.addChild(this.xorGate);
        this.addChild(this.out);
        this.in0.p0.connect(this.xorGate.in0);
        this.in1.p0.connect(this.xorGate.in1);
        this.xorGate.out.connect(this.out.p0);
    }
}
