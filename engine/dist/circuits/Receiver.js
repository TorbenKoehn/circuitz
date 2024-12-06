import Circuit from '../Circuit.js';
import Port from '../Port.js';
export default class Receiver extends Circuit {
    p0;
    constructor(init) {
        super({
            bounds: new DOMRect(init.position.x, init.position.y, 1, 1),
        });
        this.p0 = new Port({
            position: new DOMPoint(0, 0),
            clearValue: init.clearValue,
        });
        this.addPort(this.p0);
    }
    update() {
        super.update();
        this.p0.read();
    }
}
