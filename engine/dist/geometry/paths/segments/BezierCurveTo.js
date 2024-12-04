import readonly from '../../../util/readonly.js';
import Vector2 from '../../Vector2.js';
export class BezierCurveTo {
    type = 'bezierCurveTo';
    control1;
    control2;
    target;
    constructor(control1X, control1Y, control2X, control2Y, targetX, targetY) {
        this.control1 = Vector2.of(control1X, control1Y);
        this.control2 = Vector2.of(control2X, control2Y);
        this.target = Vector2.of(targetX, targetY);
    }
    get control1X() {
        return this.control1.x;
    }
    set control1X(value) {
        this.control1.x = value;
    }
    get control1Y() {
        return this.control1.y;
    }
    set control1Y(value) {
        this.control1.y = value;
    }
    get control2X() {
        return this.control2.x;
    }
    set control2X(value) {
        this.control2.x = value;
    }
    get control2Y() {
        return this.control2.y;
    }
    set control2Y(value) {
        this.control2.y = value;
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
        return `BezierCurveTo(${this.control1}, ${this.control2}, ${this.target})`;
    }
    clone() {
        return BezierCurveTo.from(this);
    }
    cloneReadonly() {
        return BezierCurveTo.readonlyFrom(this);
    }
    static of(control1X, control1Y, control2X, control2Y, targetX, targetY) {
        return new BezierCurveTo(control1X, control1Y, control2X, control2Y, targetX, targetY);
    }
    static readonly(control1X, control1Y, control2X, control2Y, targetX, targetY) {
        return readonly(BezierCurveTo.of(control1X, control1Y, control2X, control2Y, targetX, targetY));
    }
    static from(bezierCurveTo) {
        return BezierCurveTo.of(bezierCurveTo.control1X, bezierCurveTo.control1Y, bezierCurveTo.control2X, bezierCurveTo.control2Y, bezierCurveTo.targetX, bezierCurveTo.targetY);
    }
    static readonlyFrom(bezierCurveTo) {
        return BezierCurveTo.readonly(bezierCurveTo.control1X, bezierCurveTo.control1Y, bezierCurveTo.control2X, bezierCurveTo.control2Y, bezierCurveTo.targetX, bezierCurveTo.targetY);
    }
}
