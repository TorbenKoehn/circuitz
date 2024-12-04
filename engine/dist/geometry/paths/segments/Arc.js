import readonly from '../../../util/readonly.js';
import Vector2 from '../../Vector2.js';
export class Arc {
    type = 'arc';
    center;
    radius;
    startAngle;
    endAngle;
    constructor(centerX, centerY, radius, startAngle, endAngle) {
        this.center = Vector2.of(centerX, centerY);
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
    get centerX() {
        return this.center.x;
    }
    set centerX(value) {
        this.center.x = value;
    }
    get centerY() {
        return this.center.y;
    }
    set centerY(value) {
        this.center.y = value;
    }
    toString() {
        return `Arc(${this.centerX}, ${this.centerY}, ${this.radius}, ${this.startAngle}, ${this.endAngle})`;
    }
    clone() {
        return Arc.from(this);
    }
    cloneReadonly() {
        return Arc.readonlyFrom(this);
    }
    static of(centerX, centerY, radius, startAngle, endAngle) {
        return new Arc(centerX, centerY, radius, startAngle, endAngle);
    }
    static readonly(centerX, centerY, radius, startAngle, endAngle) {
        return readonly(Arc.of(centerX, centerY, radius, startAngle, endAngle));
    }
    static from(arc) {
        return Arc.of(arc.centerX, arc.centerY, arc.radius, arc.startAngle, arc.endAngle);
    }
    static readonlyFrom(arc) {
        return Arc.readonly(arc.centerX, arc.centerY, arc.radius, arc.startAngle, arc.endAngle);
    }
}
