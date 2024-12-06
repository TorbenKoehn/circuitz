import Circuit from '../../Circuit.js';
import Receiver from '../Receiver.js';
import Sender from '../Sender.js';
import CompoundMux from '../logic-gates/CompoundMux.js';
export default class MuxExample extends Circuit {
    in0;
    select;
    in1;
    mux;
    out;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 23, 20),
            backgroundColor: '#666',
        });
        this.in0 = new Sender({
            position: new DOMPoint(1, 2),
            value: 1,
            clearValue: 0,
            keyboardKey: 'KeyA',
        });
        this.select = new Sender({
            position: new DOMPoint(1, 4),
            value: 1,
            clearValue: 0,
            keyboardKey: 'KeyS',
        });
        this.in1 = new Sender({
            position: new DOMPoint(1, 9),
            value: 1,
            clearValue: 0,
            keyboardKey: 'KeyB',
        });
        this.mux = new CompoundMux(3, 1, 1, 0);
        this.out = new Receiver({ position: new DOMPoint(21, 5), clearValue: 0 });
        this.addChild(this.in0);
        this.addChild(this.select);
        this.addChild(this.in1);
        this.addChild(this.mux);
        this.addChild(this.out);
        this.in0.p0.connect(this.mux.in0);
        this.select.p0.connect(this.mux.select);
        this.in1.p0.connect(this.mux.in1);
        this.mux.out.connect(this.out.p0);
    }
}
