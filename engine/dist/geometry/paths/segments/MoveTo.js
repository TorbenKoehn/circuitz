import readonly from '../../../util/readonly.js';
import Vector2 from '../../Vector2.js';
export class MoveTo {
    type = 'moveTo';
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
        return `MoveTo(${this.targetX}, ${this.targetY})`;
    }
    clone() {
        return MoveTo.from(this);
    }
    cloneReadonly() {
        return MoveTo.readonlyFrom(this);
    }
    static of(targetX, targetY) {
        return new MoveTo(targetX, targetY);
    }
    static readonly(targetX, targetY) {
        return readonly(MoveTo.of(targetX, targetY));
    }
    static from(moveTo) {
        return MoveTo.of(moveTo.targetX, moveTo.targetY);
    }
    static readonlyFrom(moveTo) {
        return MoveTo.readonly(moveTo.targetX, moveTo.targetY);
    }
}
