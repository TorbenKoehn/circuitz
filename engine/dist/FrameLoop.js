import { Event, SetEventSource } from './Event.js';
import Stopwatch from './Stopwatch.js';
import TimeSpan from './TimeSpan.js';
export class FrameEvent extends Event {
    elapsedTime;
    deltaTime;
    constructor(elapsedTime, deltaTime) {
        super();
        this.elapsedTime = elapsedTime;
        this.deltaTime = deltaTime;
    }
    get elapsed() {
        return TimeSpan.of(this.elapsedTime);
    }
}
export default class FrameLoop {
    onFrame = new SetEventSource();
}
export class CallbackFrameLoop extends FrameLoop {
    #signal = undefined;
    #stopwatch;
    #lastElapsedTime = undefined;
    #framesPerSecond = undefined;
    #frameId = undefined;
    constructor(init) {
        super();
        this.#signal = init?.signal;
        this.#stopwatch = init?.stopwatch ?? new Stopwatch();
        this.#framesPerSecond = init?.framesPerSecond;
        this.#signal?.addEventListener('abort', this.#cancelCurrentFrame, {
            once: true,
        });
        this.#requestNextFrame();
    }
    #requestNextFrame = () => {
        this.#frameId = this.requestFrame(this.#onFrame);
    };
    #cancelCurrentFrame = () => {
        if (!this.#frameId) {
            return;
        }
        this.cancelFrame(this.#frameId);
        this.#frameId = undefined;
    };
    #onFrame = () => {
        if (this.#signal?.aborted) {
            this.#finalize();
            return;
        }
        if (!this.#stopwatch.started) {
            this.#stopwatch.start();
        }
        const elapsedTime = this.#stopwatch.elapsedTime;
        const deltaTime = this.#lastElapsedTime !== undefined
            ? elapsedTime - this.#lastElapsedTime
            : 0;
        // Skip frames depending on the target frame rate
        if (this.#lastElapsedTime !== undefined &&
            this.#framesPerSecond !== undefined) {
            const targetFrameTime = 1000 / this.#framesPerSecond;
            const timeToNextFrame = targetFrameTime - deltaTime;
            if (timeToNextFrame > 0) {
                this.#requestNextFrame();
                return;
            }
        }
        this.#lastElapsedTime = elapsedTime;
        this.#requestNextFrame();
        this.onFrame.emit(new FrameEvent(elapsedTime, deltaTime));
    };
    #finalize = () => {
        this.#cancelCurrentFrame();
        this.#signal?.removeEventListener('abort', this.#cancelCurrentFrame);
    };
}
export class RequestAnimationFrameLoop extends CallbackFrameLoop {
    constructor(init) {
        super(init);
    }
    requestFrame(callback) {
        return requestAnimationFrame(callback);
    }
    cancelFrame(handle) {
        cancelAnimationFrame(handle);
    }
    static isSupported() {
        return typeof globalThis.requestAnimationFrame !== 'undefined';
    }
}
export class TimeoutFrameLoop extends CallbackFrameLoop {
    constructor(init) {
        super(init);
    }
    requestFrame(callback) {
        return setTimeout(callback, 1);
    }
    cancelFrame(handle) {
        clearTimeout(handle);
    }
}
