import Polygon from './Polygon.js';
import readonly from '../util/readonly.js';
import Vector2 from './Vector2.js';
import { Path } from './Path.js';
export default class Rectangle {
    position;
    size;
    constructor(x, y, width, height) {
        this.position = Vector2.of(x, y);
        this.size = Vector2.of(width, height);
    }
    get x() {
        return this.position.x;
    }
    set x(value) {
        this.position.x = value;
    }
    get y() {
        return this.position.y;
    }
    set y(value) {
        this.position.y = value;
    }
    get width() {
        return this.size.x;
    }
    set width(value) {
        this.size.x = value;
    }
    get height() {
        return this.size.y;
    }
    set height(value) {
        this.size.y = value;
    }
    contains(vec) {
        return (vec.x >= this.x &&
            vec.x < this.x + this.width &&
            vec.y >= this.y &&
            vec.y < this.y + this.height);
    }
    intersectsRect(rect) {
        return !(rect.x > this.x + this.width ||
            rect.x + rect.width < this.x ||
            rect.y > this.y + this.height ||
            rect.y + rect.height < this.y);
    }
    toPath() {
        return Path.moveTo(this.position.x, this.position.y)
            .lineTo(this.position.x + this.size.x, this.position.y)
            .lineTo(this.position.x + this.size.x, this.position.y + this.size.y)
            .lineTo(this.position.x, this.position.y + this.size.y)
            .close();
    }
    toPolygon() {
        return Polygon.of([
            this.position,
            Vector2.of(this.position.x + this.size.x, this.position.y),
            Vector2.of(this.position.x + this.size.x, this.position.y + this.size.y),
            Vector2.of(this.position.x, this.position.y + this.size.y),
        ]);
    }
    toString() {
        return `Rectangle(${this.x}, ${this.y}, ${this.width}, ${this.height})`;
    }
    clone() {
        return Rectangle.from(this);
    }
    cloneReadonly() {
        return Rectangle.readonlyFrom(this);
    }
    static of(x, y, width, height) {
        return new Rectangle(x, y, width, height);
    }
    static readonly(x, y, width, height) {
        return readonly(Rectangle.of(x, y, width, height));
    }
    static from(rectangle) {
        return Rectangle.of(rectangle.x, rectangle.y, rectangle.x, rectangle.y);
    }
    static readonlyFrom(rectangle) {
        return Rectangle.readonly(rectangle.x, rectangle.y, rectangle.x, rectangle.y);
    }
}
