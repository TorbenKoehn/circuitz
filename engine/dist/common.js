import { App2 } from './App.js';
import Render2 from './components/Render2.js';
import Transform2 from './components/Transform2.js';
import FrameLoops from './FrameLoops.js';
import Rectangle from './geometry/Rectangle.js';
import RenderTargets from './systems/renderer/RenderTargets.js';
export class MyApp extends App2 {
    #rect = undefined;
    #childRect = undefined;
    #currentFps = 0;
    #lastSecond = 0;
    #lastFps = 0;
    initialize() {
        const stage = this.spawn(Render2).edit(Render2, (render) => {
            render.target = RenderTargets.canvas2ById('display').autoMaximize();
        });
        this.#rect = this.spawn(Render2)
            .edit(Transform2, (transform) => {
            transform.parent = stage.get(Transform2);
            transform.matrix.translate(500, 500);
        })
            .edit(Render2, (render) => {
            render.geometry = Rectangle.of(0, 0, 100, 100);
            render.style = {
                fillColor: 'blue',
            };
        });
        this.#childRect = this.spawn(Render2)
            .edit(Transform2, (transform) => {
            transform.parent = this.#rect.get(Transform2);
            transform.matrix.translate(25, 25);
        })
            .edit(Render2, (shape) => {
            shape.geometry = Rectangle.of(0, 0, 50, 50);
            shape.style = {
                fillColor: 'red',
            };
        });
    }
    update(event) {
        const second = Math.floor(event.elapsed.seconds);
        if (second !== this.#lastSecond) {
            this.#lastSecond = second;
            this.#lastFps = this.#currentFps;
            this.#currentFps = 0;
        }
        this.#currentFps++;
        document.getElementById('fps').innerText = `${this.#lastFps.toString()} (${second.toFixed(2)})`;
        // this.#rect!.get(Transform2).matrix.rotateAround(
        //   0,
        //   0,
        //   event.deltaTime * 0.005
        // )
    }
}
new MyApp({
    frameLoop: FrameLoops.default({ framesPerSecond: 2 }),
});
