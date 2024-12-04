import { Arc } from './paths/segments/Arc.js';
import { ArcTo } from './paths/segments/ArcTo.js';
import { BezierCurveTo } from './paths/segments/BezierCurveTo.js';
import { Close } from './paths/segments/Close.js';
import { LineTo } from './paths/segments/LineTo.js';
import { MoveTo } from './paths/segments/MoveTo.js';
import Rectangle from './Rectangle.js';
import readonly from '../util/readonly.js';
import { QuadraticCurveTo } from './paths/segments/QuadraticCurveTo.js';
import PathSegments from './paths/PathSegments.js';
export class Path {
    segments;
    constructor(segments) {
        this.segments = segments.map(PathSegments.from);
    }
    calculateBounds() {
        const vertices = this.segments
            .map((segment) => {
            if (segment instanceof MoveTo) {
                return segment.target;
            }
            if (segment instanceof LineTo) {
                return segment.target;
            }
            if (segment instanceof QuadraticCurveTo) {
                return [segment.control, segment.target];
            }
            if (segment instanceof BezierCurveTo) {
                return [segment.control1, segment.control2, segment.target];
            }
            if (segment instanceof ArcTo) {
                return [segment.control];
            }
            if (segment instanceof Arc) {
                return [segment.center];
            }
            return [];
        })
            .flat();
        const xs = vertices.map((vec) => vec.x);
        const ys = vertices.map((vec) => vec.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        return Rectangle.of(minX, minY, maxX - minX, maxY - minY);
    }
    moveTo(targetX, targetY) {
        this.segments.push(MoveTo.of(targetX, targetY));
        return this;
    }
    lineTo(targetX, targetY) {
        this.segments.push(LineTo.of(targetX, targetY));
        return this;
    }
    quadraticCurveTo(controlX, controlY, targetX, targetY) {
        this.segments.push(QuadraticCurveTo.of(controlX, controlY, targetX, targetY));
        return this;
    }
    bezierCurveTo(control1X, control1Y, control2X, control2Y, targetX, targetY) {
        this.segments.push(BezierCurveTo.of(control1X, control1Y, control2X, control2Y, targetX, targetY));
        return this;
    }
    arcTo(controlX, controlY, targetX, targetY, radius, startAngle = 0, endAngle = Math.PI * 2) {
        this.segments.push(ArcTo.of(controlX, controlY, targetX, targetY, radius, startAngle, endAngle));
        return this;
    }
    arc(centerX, centerY, radius, startAngle = 0, endAngle = Math.PI * 2) {
        this.segments.push(Arc.of(centerX, centerY, radius, startAngle, endAngle));
        return this;
    }
    close() {
        this.segments.push(Close.of());
        return this;
    }
    toString() {
        return `Path(${this.segments.join(', ')})`;
    }
    clone() {
        return Path.from(this);
    }
    cloneReadonly() {
        return Path.readonlyFrom(this);
    }
    static of(segments) {
        return new Path(segments);
    }
    static readonly(segments) {
        return readonly(Path.of(segments));
    }
    static from(path) {
        return Path.of(path.segments);
    }
    static readonlyFrom(path) {
        return Path.readonly(path.segments);
    }
    static moveTo(targetX, targetY) {
        return Path.of([MoveTo.of(targetX, targetY)]);
    }
    static lineTo(targetX, targetY) {
        return Path.of([LineTo.of(targetX, targetY)]);
    }
    static quadraticCurveTo(controlX, controlY, targetX, targetY) {
        return Path.of([QuadraticCurveTo.of(controlX, controlY, targetX, targetY)]);
    }
    static bezierCurveTo(control1X, control1Y, control2X, control2Y, targetX, targetY) {
        return Path.of([
            BezierCurveTo.of(control1X, control1Y, control2X, control2Y, targetX, targetY),
        ]);
    }
    static arcTo(controlX, controlY, targetX, targetY, radius, startAngle = 0, endAngle = Math.PI * 2) {
        return Path.of([
            ArcTo.of(controlX, controlY, targetX, targetY, radius, startAngle, endAngle),
        ]);
    }
    static arc(centerX, centerY, radius, startAngle = 0, endAngle = Math.PI * 2) {
        return Path.of([Arc.of(centerX, centerY, radius, startAngle, endAngle)]);
    }
    static close() {
        return Path.of([Close.of()]);
    }
}
