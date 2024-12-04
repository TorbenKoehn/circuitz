import Mass from '../components/Mass.js';
import Transform2 from '../components/Transform2.js';
import { Query } from '../EntityManager.js';
import Vector2 from '../geometry/Vector2.js';
import System from '../System.js';
export default class Gravity2 extends System {
    priority = 100;
    force;
    #query = new Query((entity) => entity.has(Mass) && entity.has(Transform2));
    constructor(force = Vector2.of(0, 9.8)) {
        super();
        this.force = force;
    }
    update(event) {
        const matches = event.entityManager.match(this.#query);
        for (const entity of matches) {
            const mass = entity.get(Mass);
            const transform = entity.get(Transform2);
            transform.matrix.translate(mass.weight * this.force.x * event.deltaTime * 0.00001, mass.weight * this.force.y * event.deltaTime * 0.00001);
        }
    }
}
