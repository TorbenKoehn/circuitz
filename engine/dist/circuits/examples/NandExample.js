import Circuit from '../../Circuit.js';
import Receiver from '../Receiver.js';
import Sender from '../Sender.js';
import NandGate from '../logic-gates/NandGate.js';
export default class NandExample extends Circuit {
    in;
    nandNeither;
    nandIn1;
    nandIn2;
    nandBoth;
    out0;
    out1;
    out2;
    out3;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 7, 15),
            backgroundColor: '#666',
        });
        this.in = new Sender({
            position: new DOMPoint(0, 7),
            value: 1,
            clearValue: 0,
            keyboardKey: 'KeyS',
        });
        this.nandNeither = new NandGate(2, 0, 1, 0);
        this.nandIn1 = new NandGate(2, 4, 1, 0);
        this.nandIn2 = new NandGate(2, 8, 1, 0);
        this.nandBoth = new NandGate(2, 12, 1, 0);
        this.out0 = new Receiver({ position: new DOMPoint(6, 1), clearValue: 0 });
        this.out1 = new Receiver({ position: new DOMPoint(6, 5), clearValue: 0 });
        this.out2 = new Receiver({ position: new DOMPoint(6, 9), clearValue: 0 });
        this.out3 = new Receiver({ position: new DOMPoint(6, 13), clearValue: 0 });
        this.addChild(this.in);
        this.addChild(this.nandNeither);
        this.addChild(this.nandIn1);
        this.addChild(this.nandIn2);
        this.addChild(this.nandBoth);
        this.addChild(this.out0);
        this.addChild(this.out1);
        this.addChild(this.out2);
        this.addChild(this.out3);
        this.in.p0.connect(this.nandIn1.in0);
        this.in.p0.connect(this.nandIn2.in1);
        this.in.p0.connect(this.nandBoth.in0);
        this.in.p0.connect(this.nandBoth.in1);
        this.nandNeither.out.connect(this.out0.p0);
        this.nandIn1.out.connect(this.out1.p0);
        this.nandIn2.out.connect(this.out2.p0);
        this.nandBoth.out.connect(this.out3.p0);
    }
}
