import Render2 from '../components/Render2.js';
import Transform2 from '../components/Transform2.js';
import { Query } from '../EntityManager.js';
import System from '../System.js';
import buildComponentTree from '../util/buildComponentTree.js';
import { logOnce } from '../util/logging.js';
export default class Renderer2 extends System {
    priority = 1000;
    #transformsQuery = new Query((entity) => entity.has(Transform2));
    update(event) {
        const transformEntities = event.entityManager.match(this.#transformsQuery);
        const roots = buildComponentTree(Transform2, transformEntities);
        logOnce('Renderer2.roots', roots);
        for (const root of roots) {
            const renderTarget = root.entity.getOptional(Render2)?.target;
            if (!renderTarget) {
                continue;
            }
            renderTarget.render(root);
        }
    }
}
