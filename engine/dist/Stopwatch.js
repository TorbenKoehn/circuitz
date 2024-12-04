import Clocks from './Clocks.js';
import TimeSpan from './TimeSpan.js';
export default class Stopwatch {
    #clock;
    #state = { type: 'stopped' };
    #elapsedTime = 0;
    constructor(clock) {
        this.#clock = clock ?? Clocks.default();
    }
    get started() {
        return this.#state.type === 'started';
    }
    get elapsedTime() {
        if (this.#state.type === 'started') {
            // If the stopwatch is currently running, update the elapsed time before returning it
            return this.#elapsedTime + this.#clock.now() - this.#state.startTime;
        }
        return this.#elapsedTime;
    }
    get elapsed() {
        return TimeSpan.of(this.elapsedTime);
    }
    start() {
        if (this.#state.type === 'started') {
            throw new Error('Stopwatch is already started');
        }
        this.#state = { type: 'started', startTime: this.#clock.now() };
    }
    stop() {
        if (this.#state.type !== 'started') {
            throw new Error('Stopwatch is not started');
        }
        this.#elapsedTime = this.#state.startTime - this.#clock.now();
    }
}
