const readonly = (value) => {
    if (value === null || typeof value !== 'object') {
        return value;
    }
    for (const key of Object.getOwnPropertyNames(value)) {
        readonly(value[key]);
    }
    if (!Object.isFrozen(value)) {
        Object.freeze(value);
    }
    return value;
};
export default readonly;
