import StaticClass from '../../util/StaticClass.js';
import { Canvas2RenderTarget } from './RenderTarget.js';
export default class RenderTargets extends StaticClass {
    static canvas2(element) {
        return new Canvas2RenderTarget(element);
    }
    static canvas2ById(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`No element with id "${id}"`);
        }
        if (!(element instanceof HTMLCanvasElement)) {
            throw new Error(`Element with id "${id}" is not a canvas`);
        }
        return new Canvas2RenderTarget(element);
    }
    static offCanvas2(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return new Canvas2RenderTarget(canvas);
    }
}
