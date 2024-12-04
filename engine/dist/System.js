import { Event } from './Event.js';
import TimeSpan from './TimeSpan.js';
export class UpdateEvent extends Event {
    elapsedTime;
    deltaTime;
    entityManager;
    constructor(elapsedTime, deltaTime, entityManager) {
        super();
        this.elapsedTime = elapsedTime;
        this.deltaTime = deltaTime;
        this.entityManager = entityManager;
    }
    get elapsed() {
        return TimeSpan.of(this.elapsedTime);
    }
}
export default class System {
}
