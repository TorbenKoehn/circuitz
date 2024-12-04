import StaticClass from '../../util/StaticClass.js';
import { Arc } from './segments/Arc.js';
import { ArcTo } from './segments/ArcTo.js';
import { BezierCurveTo, } from './segments/BezierCurveTo.js';
import { Close } from './segments/Close.js';
import { LineTo } from './segments/LineTo.js';
import { MoveTo } from './segments/MoveTo.js';
import { QuadraticCurveTo, } from './segments/QuadraticCurveTo.js';
export default class PathSegments extends StaticClass {
    arc(centerX, centerY, radius, startAngle, endAngle) {
        return Arc.of(centerX, centerY, radius, startAngle, endAngle);
    }
    arcTo(controlX, controlY, targetX, targetY, radius, startAngle, endAngle) {
        return ArcTo.of(controlX, controlY, targetX, targetY, radius, startAngle, endAngle);
    }
    bezierCurveTo(control1X, control1Y, control2X, control2Y, targetX, targetY) {
        return BezierCurveTo.of(control1X, control1Y, control2X, control2Y, targetX, targetY);
    }
    close() {
        return Close.of();
    }
    lineTo(targetX, targetY) {
        return LineTo.of(targetX, targetY);
    }
    moveTo(targetX, targetY) {
        return MoveTo.of(targetX, targetY);
    }
    quadraticCurveTo(controlX, controlY, targetX, targetY) {
        return QuadraticCurveTo.of(controlX, controlY, targetX, targetY);
    }
    static from(segment) {
        switch (segment.type) {
            case 'arc':
                return Arc.from(segment);
            case 'arcTo':
                return ArcTo.from(segment);
            case 'bezierCurveTo':
                return BezierCurveTo.from(segment);
            case 'close':
                return Close.from(segment);
            case 'lineTo':
                return LineTo.from(segment);
            case 'moveTo':
                return MoveTo.from(segment);
            case 'quadraticCurveTo':
                return QuadraticCurveTo.from(segment);
        }
        throw new Error(`Invalid path segment: ${segment}`);
    }
    static readonlyFrom(segment) {
        switch (segment.type) {
            case 'arc':
                return Arc.readonlyFrom(segment);
            case 'arcTo':
                return ArcTo.readonlyFrom(segment);
            case 'bezierCurveTo':
                return BezierCurveTo.readonlyFrom(segment);
            case 'close':
                return Close.readonlyFrom(segment);
            case 'lineTo':
                return LineTo.readonlyFrom(segment);
            case 'moveTo':
                return MoveTo.readonlyFrom(segment);
            case 'quadraticCurveTo':
                return QuadraticCurveTo.readonlyFrom(segment);
        }
        throw new Error(`Invalid path segment: ${segment}`);
    }
}
