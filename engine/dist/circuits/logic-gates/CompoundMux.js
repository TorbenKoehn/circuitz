import Circuit from '../../Circuit.js';
import Port from '../../Port.js';
import NandGate from './NandGate.js';
import Repeater from './../Repeater.js';
export default class CompoundMux extends Circuit {
    value;
    in0;
    select;
    in1;
    selectRepeat0;
    selectRepeat1;
    nand0;
    nand1;
    nand2;
    nand3;
    out;
    constructor(x, y, value, clearValue) {
        super({
            bounds: new DOMRect(x, y, 17, 9),
            backgroundColor: '#555',
        });
        this.value = value;
        this.in0 = new Port({
            position: new DOMPoint(0, 1),
            clearValue,
        });
        this.select = new Port({
            position: new DOMPoint(0, 3),
            clearValue,
        });
        this.in1 = new Port({
            position: new DOMPoint(0, 8),
            clearValue,
        });
        this.selectRepeat0 = new Repeater(2, 3, clearValue);
        this.selectRepeat1 = new Repeater(2, 6, clearValue);
        this.nand0 = new NandGate(4, 2, value, clearValue);
        this.nand1 = new NandGate(8, 0, value, clearValue);
        this.nand2 = new NandGate(8, 6, value, clearValue);
        this.nand3 = new NandGate(12, 3, value, clearValue);
        this.out = new Port({
            position: new DOMPoint(16, 4),
            clearValue,
        });
        this.addPort(this.in0);
        this.addPort(this.select);
        this.addPort(this.in1);
        this.addPort(this.out);
        this.addChild(this.selectRepeat0);
        this.addChild(this.selectRepeat1);
        this.addChild(this.nand0);
        this.addChild(this.nand1);
        this.addChild(this.nand2);
        this.addChild(this.nand3);
        this.in0.connect(this.nand1.in0);
        this.select.connect(this.selectRepeat0.p0);
        this.selectRepeat0.p0.connect(this.nand0.in0);
        this.selectRepeat0.p0.connect(this.nand0.in1);
        this.selectRepeat0.p0.connect(this.selectRepeat1.p0);
        this.selectRepeat1.p0.connect(this.nand2.in0);
        this.in1.connect(this.nand2.in1);
        this.nand0.out.connect(this.nand1.in1);
        this.nand1.out.connect(this.nand3.in0);
        this.nand2.out.connect(this.nand3.in1);
        this.nand3.out.connect(this.out);
    }
}
