import { TickClock, HighResolutionClock } from './Clock.js';
import StaticClass from './util/StaticClass.js';
export default class Clocks extends StaticClass {
    static #default = HighResolutionClock.isSupported()
        ? new HighResolutionClock()
        : new TickClock();
    static highResolution() {
        return new HighResolutionClock();
    }
    static tick() {
        return new TickClock();
    }
    static default() {
        return this.#default;
    }
}
