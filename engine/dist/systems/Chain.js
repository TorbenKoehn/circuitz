import System from '../System.js';
export class Chain extends System {
    priority;
    systems;
    constructor(priority, ...subSystems) {
        super();
        this.priority = priority;
        this.systems = new Set(subSystems.toSorted((a, b) => a.priority - b.priority));
    }
    add(...systems) {
        const newSystems = [...this.systems, ...systems].toSorted((a, b) => a.priority - b.priority);
        this.systems.clear();
        for (const subSystem of newSystems) {
            this.systems.add(subSystem);
        }
        return this;
    }
    remove(...systems) {
        for (const subSystem of systems) {
            this.systems.delete(subSystem);
        }
        return this;
    }
    update(event) {
        for (const subSystem of this.systems) {
            subSystem.update(event);
        }
    }
}
