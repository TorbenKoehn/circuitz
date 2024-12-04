import { RequestAnimationFrameLoop, TimeoutFrameLoop, } from './FrameLoop.js';
import StaticClass from './util/StaticClass.js';
export default class FrameLoops extends StaticClass {
    static animation(init) {
        return new RequestAnimationFrameLoop(init);
    }
    static timeout(init) {
        return new TimeoutFrameLoop(init);
    }
    static default(init) {
        return RequestAnimationFrameLoop.isSupported()
            ? FrameLoops.animation(init)
            : FrameLoops.timeout(init);
    }
}
