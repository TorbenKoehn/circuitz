import Circuit from '../Circuit.js';
import Port from '../Port.js';
export default class Repeater extends Circuit {
    p0;
    constructor(x, y, clearValue) {
        super({
            bounds: new DOMRect(x, y, 1, 1),
            backgroundColor: 'transparent',
        });
        this.p0 = new Port({
            position: new DOMPoint(0, 0),
            clearValue,
        });
        this.addPort(this.p0);
    }
}
