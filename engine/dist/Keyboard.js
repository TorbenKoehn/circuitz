export default class Keyboard {
    static #downKeys = new Set();
    static get downKeys() {
        return this.#downKeys;
    }
    static isDown(key) {
        return this.#downKeys.has(key);
    }
    static {
        addEventListener('keydown', (event) => {
            Keyboard.#downKeys.add(event.code);
        });
        addEventListener('keyup', (event) => {
            Keyboard.#downKeys.delete(event.code);
        });
    }
}
