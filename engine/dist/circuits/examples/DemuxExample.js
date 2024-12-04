import Circuit from '../../Circuit.js';
import Receiver from '../Receiver.js';
import Sender from '../Sender.js';
import CompoundDemux from '../logic-gates/CompoundDemux.js';
export default class DemuxExample extends Circuit {
    select;
    in;
    demux0;
    demux1;
    demux2;
    demux3;
    out0;
    out1;
    out2;
    out3;
    out4;
    out5;
    out6;
    out7;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 23, 39),
            backgroundColor: '#666',
        });
        this.select = new Sender(0, 19, 1);
        this.in = new Sender(0, 29, 1);
        this.demux0 = new CompoundDemux(2, 0, 1);
        this.demux1 = new CompoundDemux(2, 10, 1);
        this.demux2 = new CompoundDemux(2, 20, 1);
        this.demux3 = new CompoundDemux(2, 30, 1);
        this.out0 = new Receiver(22, 1);
        this.out1 = new Receiver(22, 7);
        this.out2 = new Receiver(22, 11);
        this.out3 = new Receiver(22, 17);
        this.out4 = new Receiver(22, 21);
        this.out5 = new Receiver(22, 27);
        this.out6 = new Receiver(22, 31);
        this.out7 = new Receiver(22, 37);
        this.addChild(this.select);
        this.addChild(this.in);
        this.addChild(this.demux0);
        this.addChild(this.demux1);
        this.addChild(this.demux2);
        this.addChild(this.demux3);
        this.addChild(this.out0);
        this.addChild(this.out1);
        this.addChild(this.out2);
        this.addChild(this.out3);
        this.addChild(this.out4);
        this.addChild(this.out5);
        this.addChild(this.out6);
        this.addChild(this.out7);
        this.select.p0.connect(this.demux1.select);
        this.select.p0.connect(this.demux3.select);
        this.in.p0.connect(this.demux2.in);
        this.in.p0.connect(this.demux3.in);
        this.demux0.out0.connect(this.out0.p0);
        this.demux0.out1.connect(this.out1.p0);
        this.demux1.out0.connect(this.out2.p0);
        this.demux1.out1.connect(this.out3.p0);
        this.demux2.out0.connect(this.out4.p0);
        this.demux2.out1.connect(this.out5.p0);
        this.demux3.out0.connect(this.out6.p0);
        this.demux3.out1.connect(this.out7.p0);
    }
}
