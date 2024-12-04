import readonly from '../util/readonly.js';
import { Path } from './Path.js';
import { Arc } from './paths/segments/Arc.js';
import { ArcTo } from './paths/segments/ArcTo.js';
import { BezierCurveTo } from './paths/segments/BezierCurveTo.js';
import { LineTo } from './paths/segments/LineTo.js';
import { MoveTo } from './paths/segments/MoveTo.js';
import { QuadraticCurveTo } from './paths/segments/QuadraticCurveTo.js';
import Vector2 from './Vector2.js';
export class Transform2Matrix {
    a;
    b;
    c;
    d;
    e;
    f;
    constructor(a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }
    get translationX() {
        return this.e;
    }
    set translationX(value) {
        this.e = value;
    }
    get translationY() {
        return this.f;
    }
    set translationY(value) {
        this.f = value;
    }
    get rotation() {
        return Math.atan2(this.b, this.a);
    }
    set rotation(value) {
        this.rotate(value - this.rotation);
    }
    get scaleX() {
        return Math.hypot(this.a, this.b);
    }
    set scaleX(value) {
        this.scale(value / this.scaleX);
    }
    get scaleY() {
        return Math.hypot(this.c, this.d);
    }
    set scaleY(value) {
        this.scale(1, value / this.scaleY);
    }
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const a = this.a * cos - this.b * sin;
        const b = this.a * sin + this.b * cos;
        const c = this.c * cos - this.d * sin;
        const d = this.c * sin + this.d * cos;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        return this;
    }
    rotateAround(originX, originY, angle) {
        return this.translate(originX, originY)
            .rotate(angle)
            .translate(-originX, -originY);
    }
    scale(x, y = x) {
        this.a *= x;
        this.b *= y;
        this.c *= x;
        this.d *= y;
        return this;
    }
    translate(x, y) {
        this.e += x * this.a + y * this.c;
        this.f += x * this.b + y * this.d;
        return this;
    }
    skew(x, y) {
        const tanX = Math.tan(x);
        const tanY = Math.tan(y);
        const a = this.a + this.c * tanY;
        const b = this.b + this.d * tanY;
        const c = this.c + this.a * tanX;
        const d = this.d + this.b * tanX;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        return this;
    }
    multiply(transform) {
        const a = this.a * transform.a + this.b * transform.c;
        const b = this.a * transform.b + this.b * transform.d;
        const c = this.c * transform.a + this.d * transform.c;
        const d = this.c * transform.b + this.d * transform.d;
        const e = this.e * transform.a + this.f * transform.c + transform.e;
        const f = this.e * transform.b + this.f * transform.d + transform.f;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        return this;
    }
    project(x, y) {
        return Vector2.of(x * this.a + y * this.c + this.e, x * this.b + y * this.d + this.f);
    }
    projectVector2(vec) {
        return this.project(vec.x, vec.y);
    }
    projectLine(line) {
        return this.projectPath(line.toPath());
    }
    projectRectangle(rectangle) {
        return this.projectPath(rectangle.toPath());
    }
    projectCircle(circle, sides) {
        return this.projectPath(circle.toPath(sides));
    }
    projectPolygon(polygon) {
        return this.projectPath(polygon.toPath());
    }
    projectPathSegment(segment) {
        if (segment instanceof MoveTo) {
            const target = this.projectVector2(segment.target);
            return MoveTo.of(target.x, target.y);
        }
        if (segment instanceof LineTo) {
            const target = this.projectVector2(segment.target);
            return LineTo.of(target.x, target.y);
        }
        if (segment instanceof QuadraticCurveTo) {
            const control = this.projectVector2(segment.control);
            const target = this.projectVector2(segment.target);
            return QuadraticCurveTo.of(control.x, control.y, target.x, target.y);
        }
        if (segment instanceof BezierCurveTo) {
            const control1 = this.projectVector2(segment.control1);
            const control2 = this.projectVector2(segment.control2);
            const target = this.projectVector2(segment.target);
            return BezierCurveTo.of(control1.x, control1.y, control2.x, control2.y, target.x, target.y);
        }
        if (segment instanceof ArcTo) {
            const control = this.projectVector2(segment.control);
            const target = this.projectVector2(segment.target);
            return ArcTo.of(control.x, control.y, target.x, target.y, segment.radius, segment.startAngle, segment.endAngle);
        }
        if (segment instanceof Arc) {
            const center = this.projectVector2(segment.center);
            return Arc.of(center.x, center.y, segment.radius, segment.startAngle, segment.endAngle);
        }
        return segment.clone();
    }
    projectPath(path) {
        return Path.of(path.segments.map((segment) => this.projectPathSegment(segment)));
    }
    toString() {
        return `Transform2Matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`;
    }
    clone() {
        return Transform2Matrix.from(this);
    }
    cloneReadonly() {
        return Transform2Matrix.readonlyFrom(this);
    }
    static of(a, b, c, d, e, f) {
        return new Transform2Matrix(a, b, c, d, e, f);
    }
    static readonly(a, b, c, d, e, f) {
        return readonly(Transform2Matrix.of(a, b, c, d, e, f));
    }
    static from(transform) {
        return Transform2Matrix.of(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
    }
    static readonlyFrom(transform) {
        return Transform2Matrix.readonly(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
    }
    static identity() {
        return new Transform2Matrix(1, 0, 0, 1, 0, 0);
    }
    static rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Transform2Matrix(cos, sin, -sin, cos, 0, 0);
    }
    static scale(x, y = x) {
        return new Transform2Matrix(x, 0, 0, y, 0, 0);
    }
    static translate(x, y) {
        return new Transform2Matrix(1, 0, 0, 1, x, y);
    }
    static skew(x, y) {
        const tanX = Math.tan(x);
        const tanY = Math.tan(y);
        return new Transform2Matrix(1, tanY, tanX, 1, 0, 0);
    }
    static multiply(a, b) {
        return new Transform2Matrix(a.a * b.a + a.b * b.c, a.a * b.b + a.b * b.d, a.c * b.a + a.d * b.c, a.c * b.b + a.d * b.d, a.e * b.a + a.f * b.c + b.e, a.e * b.b + a.f * b.d + b.f);
    }
}
