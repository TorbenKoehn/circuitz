import Circuit from '../../Circuit.js';
import Sender from '../Sender.js';
import CompoundMux from '../CompoundMux.js';
export default class MuxExample extends Circuit {
    in0;
    select;
    in1;
    mux0;
    mux1;
    mux2;
    mux3;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 40, 41),
        });
        this.in0 = new Sender(1, 10, 1);
        this.select = new Sender(1, 20, 1);
        this.in1 = new Sender(1, 30, 1);
        this.mux0 = new CompoundMux(10, 1, 1);
        this.mux1 = new CompoundMux(10, 11, 1);
        this.mux2 = new CompoundMux(10, 21, 1);
        this.mux3 = new CompoundMux(10, 31, 1);
        this.addChild(this.in0);
        this.addChild(this.select);
        this.addChild(this.in1);
        this.addChild(this.mux0);
        this.addChild(this.mux1);
        this.addChild(this.mux2);
        this.addChild(this.mux3);
        this.in0.p0.connect(this.mux0.in0);
        this.in0.p0.connect(this.mux1.in0);
        this.select.p0.connect(this.mux1.select);
        this.select.p0.connect(this.mux3.select);
        this.in1.p0.connect(this.mux2.in1);
        this.in1.p0.connect(this.mux3.in1);
    }
    drawBackground(args) {
        super.drawBackground(args);
        const context = args.context;
        const position = args.bounds;
        const bounds = new DOMRect(position.x * args.gridSize, position.y * args.gridSize, this.bounds.width * args.gridSize, this.bounds.height * args.gridSize);
        context.fillStyle = '#666';
        context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
}
