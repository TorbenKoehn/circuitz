import Keyboard from './Keyboard.js';
export default class Simulation {
    circuit;
    canvas;
    #tickInterval;
    #showFps;
    #lastFps = 0;
    #lastSecond = 0;
    #currentFps = 0;
    constructor(options) {
        this.circuit = options.circuit;
        this.canvas = options.canvas ?? document.createElement('canvas');
        this.#tickInterval = options.tickInterval ?? 1000;
        this.#showFps = options.showFps ?? false;
    }
    maximizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    start(options) {
        addEventListener('resize', () => this.maximizeCanvas(), {
            signal: options?.signal,
        });
        this.maximizeCanvas();
        const context = this.canvas.getContext('2d');
        let lastTickTime = performance.now();
        const update = () => {
            if (options?.signal?.aborted) {
                return;
            }
            requestAnimationFrame(update);
            this.circuit.update();
            const currentTime = performance.now();
            const currentSecond = Math.floor(currentTime / 1000);
            const tickDelta = currentTime - lastTickTime;
            if (tickDelta > this.#tickInterval) {
                this.circuit.tick();
                lastTickTime = currentTime;
            }
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.circuit.draw({
                context,
            });
            if (this.#showFps) {
                if (currentSecond !== this.#lastSecond) {
                    this.#lastFps = this.#currentFps;
                    this.#currentFps = 0;
                    this.#lastSecond = currentSecond;
                }
                this.#currentFps++;
                context.fillStyle = 'white';
                context.textAlign = 'left';
                context.font = '12px monospace';
                context.fillText(`FPS: ${this.#lastFps}`, 10, 20);
            }
            const downKeys = Keyboard.downKeys;
            context.fillStyle = 'white';
            context.textAlign = 'left';
            context.font = '12px monospace';
            context.fillText(`Down Keys: ${Array.from(downKeys).join(', ')}`, 10, 40);
        };
        update();
    }
}
