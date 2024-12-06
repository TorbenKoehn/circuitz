export default abstract class Keyboard {
  static #downKeys = new Set<string>()

  static get downKeys(): ReadonlySet<string> {
    return this.#downKeys
  }

  static isDown(key: string): boolean {
    return this.#downKeys.has(key)
  }

  static {
    addEventListener('keydown', (event) => {
      Keyboard.#downKeys.add(event.code)
    })

    addEventListener('keyup', (event) => {
      Keyboard.#downKeys.delete(event.code)
    })
  }
}
