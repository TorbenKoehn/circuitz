export default class Clock {
}
export class HighResolutionClock extends Clock {
    now() {
        return performance.now();
    }
    static isSupported() {
        return typeof globalThis.performance !== 'undefined';
    }
}
export class TickClock extends Clock {
    now() {
        return Date.now();
    }
}
