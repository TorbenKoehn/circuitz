import DemuxExample from './circuits/examples/DemuxExample.js';
const start = (circuit) => {
    const canvas = document.getElementById('display');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');
    let lastTickTime = performance.now();
    const update = () => {
        requestAnimationFrame(update);
        const currentTime = performance.now();
        const tickDelta = currentTime - lastTickTime;
        if (tickDelta > 100) {
            circuit.tick();
            lastTickTime = currentTime;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        circuit.draw({
            context,
            bounds: new DOMRect(0, 0, canvas.width, canvas.height),
            gridSize: 20,
        });
    };
    update();
};
start(new DemuxExample(0, 0));
