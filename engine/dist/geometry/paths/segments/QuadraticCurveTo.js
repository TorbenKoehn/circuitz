import readonly from '../../../util/readonly.js';
import Vector2 from '../../Vector2.js';
export class QuadraticCurveTo {
    type = 'quadraticCurveTo';
    control;
    target;
    constructor(controlX, controlY, targetX, targetY) {
        this.control = Vector2.of(controlX, controlY);
        this.target = Vector2.of(targetX, targetY);
    }
    get controlX() {
        return this.control.x;
    }
    set controlX(value) {
        this.control.x = value;
    }
    get controlY() {
        return this.control.y;
    }
    set controlY(value) {
        this.control.y = value;
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
        return `QuadraticCurveTo(${this.controlX}, ${this.controlY}, ${this.targetX}, ${this.targetY})`;
    }
    clone() {
        return QuadraticCurveTo.from(this);
    }
    cloneReadonly() {
        return readonly(QuadraticCurveTo.readonlyFrom(this));
    }
    static of(controlX, controlY, targetX, targetY) {
        return new QuadraticCurveTo(controlX, controlY, targetX, targetY);
    }
    static readonly(controlX, controlY, targetX, targetY) {
        return QuadraticCurveTo.of(controlX, controlY, targetX, targetY);
    }
    static from(quadraticCurveTo) {
        return QuadraticCurveTo.of(quadraticCurveTo.controlX, quadraticCurveTo.controlY, quadraticCurveTo.targetX, quadraticCurveTo.targetY);
    }
    static readonlyFrom(quadraticCurveTo) {
        return QuadraticCurveTo.readonly(quadraticCurveTo.controlX, quadraticCurveTo.controlY, quadraticCurveTo.targetX, quadraticCurveTo.targetY);
    }
}
