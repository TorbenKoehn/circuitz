import Circuit from '../Circuit.js';
import Keyboard from '../Keyboard.js';
import Port from '../Port.js';
export default class Sender extends Circuit {
    value;
    p0;
    keyboardKey;
    constructor(init) {
        super({
            bounds: new DOMRect(init.position.x, init.position.y, 1, 1),
        });
        this.value = init.value;
        this.p0 = new Port({
            position: new DOMPoint(0, 0),
            clearValue: init.clearValue,
        });
        this.keyboardKey = init.keyboardKey;
        this.addPort(this.p0);
    }
    update() {
        super.update();
        if (!this.keyboardKey || Keyboard.isDown(this.keyboardKey)) {
            this.p0.write(this.value);
        }
    }
    draw(args) {
        super.draw(args);
        const context = args.context;
        const bounds = this.absolutePixelBounds;
        // If a key is set, draw the key name below the port
        if (this.keyboardKey) {
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.font = '12px monospace';
            context.fillText(this.keyboardKey, bounds.x + bounds.width / 2, bounds.y + bounds.height + 12);
        }
    }
}
