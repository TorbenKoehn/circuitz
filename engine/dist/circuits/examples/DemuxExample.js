import Circuit from '../../Circuit.js';
import Receiver from '../Receiver.js';
import Sender from '../Sender.js';
import CompoundDemux from '../logic-gates/CompoundDemux.js';
export default class DemuxExample extends Circuit {
    select;
    in;
    demux;
    out0;
    out1;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 25, 11),
            backgroundColor: '#666',
        });
        this.select = new Sender({
            position: new DOMPoint(1, 1),
            value: 1,
            clearValue: 0,
            keyboardKey: 'KeyS',
        });
        this.in = new Sender({
            position: new DOMPoint(1, 4),
            value: 1,
            clearValue: 0,
            keyboardKey: 'KeyA',
        });
        this.demux = new CompoundDemux(3, 1, 1, 0);
        this.out0 = new Receiver({ position: new DOMPoint(23, 2), clearValue: 0 });
        this.out1 = new Receiver({ position: new DOMPoint(23, 8), clearValue: 0 });
        this.addChildren([this.select, this.in, this.demux, this.out0, this.out1]);
        this.in.p0.connect(this.demux.in);
        this.select.p0.connect(this.demux.select);
        this.demux.out0.connect(this.out0.p0);
        this.demux.out1.connect(this.out1.p0);
    }
}
