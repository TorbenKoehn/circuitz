import EntityManager from './EntityManager.js';
import FrameLoops from './FrameLoops.js';
import System, { UpdateEvent } from './System.js';
import Systems from './Systems.js';
import { Chain } from './systems/Chain.js';
export default class App extends System {
    priority;
    #rootSystem;
    #entityManager;
    #frameLoop;
    #initialized = false;
    constructor(options) {
        super();
        this.priority = options?.priority ?? 0;
        this.#rootSystem = new Chain(this.priority, this, ...(options?.systems ?? []));
        this.#frameLoop = options?.frameLoop ?? FrameLoops.default();
        this.#entityManager = options?.entityManager ?? new EntityManager();
        this.#frameLoop.onFrame.addListener(this.#onFrame);
    }
    get systems() {
        return this.#rootSystem.systems;
    }
    get entityManager() {
        return this.#entityManager;
    }
    addSystems(...systems) {
        this.#rootSystem.add(...systems);
    }
    removeSystems(...systems) {
        this.#rootSystem.remove(...systems);
    }
    spawn(...componentTypes) {
        return this.#entityManager.add(...componentTypes);
    }
    despawn(entity) {
        this.#entityManager.remove(entity);
    }
    #onFrame = (event) => {
        if (!this.#initialized) {
            this.initialize();
            this.#initialized = true;
        }
        this.#rootSystem.update(new UpdateEvent(event.elapsedTime, event.deltaTime, this.#entityManager));
    };
}
export class App2 extends App {
    constructor(options) {
        super(options);
        this.addSystems(Systems.renderer2());
    }
}
