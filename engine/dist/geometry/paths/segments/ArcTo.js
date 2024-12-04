import readonly from '../../../util/readonly.js';
import Vector2 from '../../Vector2.js';
export class ArcTo {
    type = 'arcTo';
    control;
    target;
    radius;
    startAngle;
    endAngle;
    constructor(controlX, controlY, targetX, targetY, radius, startAngle, endAngle) {
        this.control = Vector2.of(controlX, controlY);
        this.target = Vector2.of(targetX, targetY);
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
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
        return `ArcTo(${this.control}, ${this.target}, ${this.radius}, ${this.startAngle}, ${this.endAngle})`;
    }
    clone() {
        return ArcTo.from(this);
    }
    cloneReadonly() {
        return readonly(ArcTo.readonlyFrom(this));
    }
    static of(controlX, controlY, targetX, targetY, radius, startAngle, endAngle) {
        return new ArcTo(controlX, controlY, targetX, targetY, radius, startAngle, endAngle);
    }
    static readonly(controlX, controlY, targetX, targetY, radius, startAngle, endAngle) {
        return ArcTo.of(controlX, controlY, targetX, targetY, radius, startAngle, endAngle);
    }
    static from(arcTo) {
        return ArcTo.of(arcTo.controlX, arcTo.controlY, arcTo.targetX, arcTo.targetY, arcTo.radius, arcTo.startAngle, arcTo.endAngle);
    }
    static readonlyFrom(arcTo) {
        return ArcTo.readonly(arcTo.controlX, arcTo.controlY, arcTo.targetX, arcTo.targetY, arcTo.radius, arcTo.startAngle, arcTo.endAngle);
    }
}
