import Circuit from '../../Circuit.js';
import Sender from '../Sender.js';
import CompoundXnorGate from '../logic-gates/CompoundXnorGate.js';
import Receiver from '../Receiver.js';
export default class XnorExample extends Circuit {
    in0;
    in1;
    xnorGate;
    out0;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 25, 13),
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
        this.xnorGate = new CompoundXnorGate(3, 1, 1, 0);
        this.out0 = new Receiver({ position: new DOMPoint(23, 7), clearValue: 0 });
        this.addChild(this.in0);
        this.addChild(this.in1);
        this.addChild(this.xnorGate);
        this.addChild(this.out0);
        this.in0.p0.connect(this.xnorGate.in0);
        this.in1.p0.connect(this.xnorGate.in1);
        this.xnorGate.out.connect(this.out0.p0);
    }
}
