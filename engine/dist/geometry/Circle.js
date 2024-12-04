import Polygon from '../geometry/Polygon.js';
import readonly from '../util/readonly.js';
import Vector2 from './Vector2.js';
import Rectangle from './Rectangle.js';
import { Path } from './Path.js';
import { MoveTo } from './paths/segments/MoveTo.js';
import { LineTo } from './paths/segments/LineTo.js';
export default class Circle {
    center;
    radius;
    constructor(centerX, centerY, radius) {
        this.center = Vector2.of(centerX, centerY);
        this.radius = radius;
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
    calculateBounds() {
        return Rectangle.of(this.center.x - this.radius, this.center.y - this.radius, this.radius * 2, this.radius * 2);
    }
    toPath(segmentCount = 32) {
        return Path.of(Array.from({ length: segmentCount }, (_, i) => {
            const angle = (i / segmentCount) * Math.PI * 2;
            const x = this.center.x + Math.cos(angle) * this.radius;
            const y = this.center.y + Math.sin(angle) * this.radius;
            if (i === 0) {
                return MoveTo.of(x, y);
            }
            return LineTo.of(x, y);
        }));
    }
    toPolygon(segmentCount = 32) {
        return Polygon.of(Array.from({ length: segmentCount }, (_, i) => {
            const angle = (i / segmentCount) * Math.PI * 2;
            return Vector2.of(this.center.x + Math.cos(angle) * this.radius, this.center.y + Math.sin(angle) * this.radius);
        }));
    }
    toString() {
        return `Circle(${this.centerX}, ${this.centerY}, ${this.radius})`;
    }
    clone() {
        return Circle.from(this);
    }
    cloneReadonly() {
        return Circle.readonlyFrom(this);
    }
    static of(centerX, centerY, radius) {
        return new Circle(centerX, centerY, radius);
    }
    static readonly(centerX, centerY, radius) {
        return readonly(new Circle(centerX, centerY, radius));
    }
    static from(circle) {
        return Circle.of(circle.centerX, circle.centerY, circle.radius);
    }
    static readonlyFrom(circle) {
        return Circle.readonly(circle.centerX, circle.centerY, circle.radius);
    }
}
