import readonly from '../util/readonly.js';
import { Path } from './Path.js';
import Rectangle from './Rectangle.js';
import Vector2 from './Vector2.js';
export default class Line {
    start;
    end;
    constructor(startX, startY, endX, endY) {
        this.start = Vector2.of(startX, startY);
        this.end = Vector2.of(endX, endY);
    }
    get startX() {
        return this.start.x;
    }
    set startX(value) {
        this.start.x = value;
    }
    get startY() {
        return this.start.y;
    }
    set startY(value) {
        this.start.y = value;
    }
    get endX() {
        return this.end.x;
    }
    set endX(value) {
        this.end.x = value;
    }
    get endY() {
        return this.end.y;
    }
    set endY(value) {
        this.end.y = value;
    }
    calculateBounds() {
        return Rectangle.of(Math.min(this.startX, this.endX), Math.min(this.startY, this.endY), Math.abs(this.endX - this.startX), Math.abs(this.endY - this.startY));
    }
    toPath() {
        return Path.moveTo(this.startX, this.startY).lineTo(this.endX, this.endY);
    }
    toString() {
        return `Line(${this.startX}, ${this.startY}, ${this.endX}, ${this.endY})`;
    }
    clone() {
        return Line.from(this);
    }
    cloneReadonly() {
        return Line.readonlyFrom(this);
    }
    static of(startX, startY, endX, endY) {
        return new Line(startX, startY, endX, endY);
    }
    static readonly(startX, startY, endX, endY) {
        return readonly(Line.of(startX, startY, endX, endY));
    }
    static from(line) {
        return Line.of(line.startX, line.startY, line.endX, line.endY);
    }
    static readonlyFrom(line) {
        return Line.readonly(line.startX, line.startY, line.endX, line.endY);
    }
}
