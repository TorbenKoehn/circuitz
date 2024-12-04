export default class StaticClass {
    constructor() {
        throw new Error(`The class ${this.constructor.name} is static and cannot be instantiated. Use its static methods instead.`);
    }
}
