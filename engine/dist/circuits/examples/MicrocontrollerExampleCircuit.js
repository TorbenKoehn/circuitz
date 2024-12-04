import Circuit from '../../Circuit.js';
import FixedReceiver from '../FixedReceiver.js';
import FixedSender from '../FixedSender.js';
import Microcontroller from '../Microcontroller.js';
export default class McExample extends Circuit {
    in1;
    out1;
    mc1;
    mc2;
    constructor(x, y) {
        super({
            bounds: new DOMRect(x, y, 40, 20),
        });
        this.in1 = new FixedSender(1, 1, 100);
        this.out1 = new FixedReceiver(38, 1);
        this.mc1 = new Microcontroller(4, 1, [
            { command: 'slx', args: ['p0'] },
            { command: 'mov', args: ['p0', 'acc'] },
            { command: 'sub', args: ['50'] },
            { label: 'loop', command: 'nop', args: [] },
            { command: 'add', args: ['1'] },
            { command: 'cmp', args: ['acc', '55'] },
            { command: 'jl', args: ['loop'] },
            { command: 'mov', args: ['acc', 'p2'] },
            { label: 'end', command: 'slp', args: ['2'] },
        ]);
        this.mc2 = new Microcontroller(20, 1, [
            { command: 'slx', args: ['p1'] },
            { command: 'mov', args: ['p1', 'acc'] },
            { command: 'mul', args: ['4'] },
            { command: 'mov', args: ['acc', 'p2'] },
        ]);
        this.addChild(this.in1);
        this.addChild(this.out1);
        this.addChild(this.mc1);
        this.addChild(this.mc2);
        this.in1.p0.connect(this.mc1.p0);
        this.mc1.p2.connect(this.mc2.p1);
        this.mc2.p2.connect(this.out1.p0);
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
