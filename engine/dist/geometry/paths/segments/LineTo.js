import readonly from '../../../util/readonly.js';
import Vector2 from '../../Vector2.js';
export class LineTo {
    type = 'lineTo';
    target;
    constructor(targetX, targetY) {
        this.target = Vector2.of(targetX, targetY);
    }
    get targetX() {
        return this.target.x;
    }
    set targetX(value) {
        this.target.x = value;
    }
    get targetY() {
        return this.target.y;
    }
    set targetY(value) {
        this.target.y = value;
    }
    toString() {
        return `LineTo(${this.targetX}, ${this.targetY})`;
    }
    clone() {
        return LineTo.from(this);
    }
    cloneReadonly() {
        return LineTo.readonlyFrom(this);
    }
    static of(targetX, targetY) {
        return new LineTo(targetX, targetY);
    }
    static readonly(targetX, targetY) {
        return readonly(LineTo.of(targetX, targetY));
    }
    static from(lineTo) {
        return LineTo.of(lineTo.targetX, lineTo.targetY);
    }
    static readonlyFrom(lineTo) {
        return LineTo.readonly(lineTo.targetX, lineTo.targetY);
    }
}
