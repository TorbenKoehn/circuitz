const buildComponentTree = (componentType, entities) => {
    const nodes = new Map();
    const rootNodes = new Set();
    for (const entity of entities) {
        const component = entity.getOptional(componentType);
        if (!component) {
            continue;
        }
        const node = nodes.get(component) ?? {
            component,
            entity,
            children: new Set(),
        };
        nodes.set(component, node);
        const parent = component.parent;
        if (!parent) {
            rootNodes.add(node);
            continue;
        }
        const parentNode = nodes.get(parent) ?? {
            component: parent,
            entity,
            children: new Set(),
        };
        parentNode.children.add(node);
        nodes.set(parent, parentNode);
    }
    return rootNodes;
};
export default buildComponentTree;
