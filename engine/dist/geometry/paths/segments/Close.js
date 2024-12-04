import readonly from '../../../util/readonly.js';
export class Close {
    type = 'close';
    constructor() { }
    toString() {
        return 'Close()';
    }
    clone() {
        return Close.from(this);
    }
    cloneReadonly() {
        return readonly(Close.readonlyFrom(this));
    }
    static of() {
        return new Close();
    }
    static readonly() {
        return Close.of();
    }
    static from(_close) {
        return Close.of();
    }
    static readonlyFrom(_close) {
        return Close.of();
    }
}
