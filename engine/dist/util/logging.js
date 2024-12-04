const logCounts = new Map();
export const logTimes = (id, times, ...args) => {
    const callCount = logCounts.get(id) ?? 0;
    if (callCount >= times) {
        return;
    }
    logCounts.set(id, callCount + 1);
    console.log(`[${id}:${callCount + 1}]`, ...args);
};
export const logOnce = (id, ...args) => logTimes(id, 1, ...args);
export const logTwice = (id, ...args) => logTimes(id, 2, ...args);
export const logThrice = (id, ...args) => logTimes(id, 3, ...args);
