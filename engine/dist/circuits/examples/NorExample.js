import Circuit from '../../Circuit.js';
import Receiver from '../Receiver.js';
import Sender from '../Sender.js';
import CompoundNorGate from '../logic-gates/CompoundNorGate.js';
export default class NorExample extends Circuit {
    in;
    norNeither;
    norIn1;
    norIn2;
    norBoth;
    out0;
    out1;
    out2;
    out3;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 19, 31),
            backgroundColor: '#666',
        });
        this.in = new Sender(0, 15, 1);
        this.norNeither = new CompoundNorGate(2, 0, 1);
        this.norIn1 = new CompoundNorGate(2, 8, 1);
        this.norIn2 = new CompoundNorGate(2, 16, 1);
        this.norBoth = new CompoundNorGate(2, 24, 1);
        this.out0 = new Receiver(18, 3);
        this.out1 = new Receiver(18, 11);
        this.out2 = new Receiver(18, 19);
        this.out3 = new Receiver(18, 27);
        this.addChild(this.in);
        this.addChild(this.norNeither);
        this.addChild(this.norIn1);
        this.addChild(this.norIn2);
        this.addChild(this.norBoth);
        this.addChild(this.out0);
        this.addChild(this.out1);
        this.addChild(this.out2);
        this.addChild(this.out3);
        this.in.p0.connect(this.norIn1.in0);
        this.in.p0.connect(this.norIn2.in1);
        this.in.p0.connect(this.norBoth.in0);
        this.in.p0.connect(this.norBoth.in1);
        this.norNeither.out.connect(this.out0.p0);
        this.norIn1.out.connect(this.out1.p0);
        this.norIn2.out.connect(this.out2.p0);
        this.norBoth.out.connect(this.out3.p0);
    }
}
