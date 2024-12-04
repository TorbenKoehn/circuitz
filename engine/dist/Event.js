export class Event {
}
export default class EventSource {
}
export class SetEventSource extends EventSource {
    #listeners = new Set();
    addListener(listener) {
        this.#listeners.add(listener);
    }
    removeListener(listener) {
        this.#listeners.delete(listener);
    }
    emit(data) {
        for (const listener of this.#listeners) {
            listener(data);
        }
    }
}
