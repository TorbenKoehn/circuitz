import readonly from '../util/readonly.js';
import Vector2 from './Vector2.js';
import Rectangle from './Rectangle.js';
import { Path } from './Path.js';
import { MoveTo } from './paths/segments/MoveTo.js';
import { LineTo } from './paths/segments/LineTo.js';
export default class Polygon {
    vertices;
    constructor(vertices) {
        this.vertices = vertices.map(Vector2.from);
    }
    calculateBounds() {
        const xs = this.vertices.map((vec) => vec.x);
        const ys = this.vertices.map((vec) => vec.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        return Rectangle.of(minX, minY, maxX - minX, maxY - minY);
    }
    toPath() {
        return Path.of(this.vertices.map((vec, index) => {
            if (index === 0) {
                return MoveTo.of(vec.x, vec.y);
            }
            return LineTo.of(vec.x, vec.y);
        })).close();
    }
    toString() {
        return `Polygon(${this.vertices.map((vec) => vec.toString()).join(', ')})`;
    }
    clone() {
        return Polygon.from(this);
    }
    cloneReadonly() {
        return Polygon.readonlyFrom(this);
    }
    static of(vertices) {
        return new Polygon(vertices);
    }
    static readonly(vertices) {
        return readonly(Polygon.of(vertices));
    }
    static from(polygon) {
        return Polygon.of(polygon.vertices);
    }
    static readonlyFrom(polygon) {
        return Polygon.readonly(polygon.vertices);
    }
}
