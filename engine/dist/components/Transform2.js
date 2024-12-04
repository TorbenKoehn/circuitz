import { Transform2Matrix } from '../geometry/Transform2Matrix.js';
export default class Transform2 {
    matrix = Transform2Matrix.identity();
    parent;
    get x() {
        return this.matrix.translationX;
    }
    set x(value) {
        this.matrix.translationX = value;
    }
    get y() {
        return this.matrix.translationY;
    }
    set y(value) {
        this.matrix.translationY = value;
    }
    get rotation() {
        return this.matrix.rotation;
    }
    set rotation(value) {
        this.matrix.rotation = value;
    }
    get scaleX() {
        return this.matrix.scaleX;
    }
    set scaleX(value) {
        this.matrix.scaleX = value;
    }
    get scaleY() {
        return this.matrix.scaleY;
    }
    set scaleY(value) {
        this.matrix.scaleY = value;
    }
}
