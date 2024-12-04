import StaticClass from './util/StaticClass.js';
import Renderer2 from './systems/Renderer2.js';
import { Chain } from './systems/Chain.js';
import Gravity2 from './systems/Gravity2.js';
export default class Systems extends StaticClass {
    static chain(priority, ...systems) {
        return new Chain(priority, ...systems);
    }
    static gravity2() {
        return new Gravity2();
    }
    static renderer2() {
        return new Renderer2();
    }
}
