import Circuit from '../../Circuit.js';
import Port from '../../Port.js';
import NorGate from '../logic-gates/NorGate.js';
import Repeater from '../Repeater.js';
export default class CompoundRsNorFlipFlop extends Circuit {
    set;
    reset;
    nor0;
    nor1;
    nor0Repeat;
    nor1Repeat;
    out0;
    out1;
    constructor(x, y, value, clearValue) {
        super({
            bounds: new DOMRect(x, y, 9, 7),
            backgroundColor: '#555',
        });
        this.set = new Port({
            position: new DOMPoint(0, 1),
            clearValue,
        });
        this.reset = new Port({
            position: new DOMPoint(0, 5),
            clearValue,
        });
        this.nor0 = new NorGate(2, 0, value, clearValue);
        this.nor1 = new NorGate(2, 4, value, clearValue);
        this.nor0Repeat = new Repeater(6, 1, clearValue);
        this.nor1Repeat = new Repeater(6, 5, clearValue);
        this.out0 = new Port({
            position: new DOMPoint(8, 1),
            clearValue,
        });
        this.out1 = new Port({
            position: new DOMPoint(8, 5),
            clearValue,
        });
        this.addChildren([this.nor0, this.nor1, this.nor0Repeat, this.nor1Repeat]);
        this.addPorts([this.set, this.reset, this.out0, this.out1]);
        this.set.connect(this.nor0.in0);
        this.reset.connect(this.nor1.in1);
        this.nor0.out.connect(this.nor0Repeat.p0);
        this.nor0Repeat.p0.connect(this.nor1.in0, { lineStyle: 'diagonal' });
        this.nor1.out.connect(this.nor1Repeat.p0);
        this.nor1Repeat.p0.connect(this.nor0.in1, { lineStyle: 'diagonal' });
        this.nor0Repeat.p0.connect(this.out0);
        this.nor1Repeat.p0.connect(this.out1);
    }
}
