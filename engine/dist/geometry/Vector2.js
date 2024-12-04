import readonly from '../util/readonly.js';
export default class Vector2 {
    x;
    y;
    static zero = Vector2.readonly(0, 0);
    static one = Vector2.readonly(1, 1);
    static left = Vector2.readonly(-1, 0);
    static right = Vector2.readonly(1, 0);
    static up = Vector2.readonly(0, -1);
    static down = Vector2.readonly(0, 1);
    static infinity = Vector2.readonly(Infinity, Infinity);
    static negativeInfinity = Vector2.readonly(-Infinity, -Infinity);
    static epsilon = Vector2.readonly(Number.EPSILON, Number.EPSILON);
    static min = Vector2.readonly(Number.MIN_VALUE, Number.MIN_VALUE);
    static max = Vector2.readonly(Number.MAX_VALUE, Number.MAX_VALUE);
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `Vector2(${this.x}, ${this.y})`;
    }
    clone() {
        return Vector2.from(this);
    }
    cloneReadonly() {
        return Vector2.readonlyFrom(this);
    }
    static of(x, y) {
        return new Vector2(x, y);
    }
    static readonly(x, y) {
        return readonly(Vector2.of(x, y));
    }
    static from(vec) {
        return Vector2.of(vec.x, vec.y);
    }
    static readonlyFrom(vec) {
        return Vector2.readonly(vec.x, vec.y);
    }
}
