import { SetEventSource } from './Event.js';
export class ComponentsChangeEvent {
    addedComponents;
    removedComponents;
    constructor(addedComponents, removedComponents) {
        this.addedComponents = addedComponents;
        this.removedComponents = removedComponents;
    }
    get addedComponentTypes() {
        return this.addedComponents.map((component) => component.constructor);
    }
    get removedComponentTypes() {
        return this.removedComponents.map((component) => component.constructor);
    }
    get affectedComponents() {
        return this.addedComponents.concat(this.removedComponents);
    }
    get affectedComponentTypes() {
        return this.addedComponentTypes.concat(this.removedComponentTypes);
    }
}
export class ComponentNotFoundError extends Error {
    componentType;
    constructor(componentType) {
        super(`Component of type ${componentType.name} not found. You must add it first.`);
        this.componentType = componentType;
    }
}
export default class ComponentContainer {
    onChange = new SetEventSource();
    #components = new Map();
    has(componentType) {
        return this.#components.has(componentType);
    }
    get(componentType) {
        const result = this.#components.get(componentType);
        if (!result) {
            throw new ComponentNotFoundError(componentType);
        }
        return result;
    }
    getOptional(componentType) {
        return this.#components.get(componentType);
    }
    edit(componentType, edit) {
        const component = this.get(componentType);
        edit(component);
        return this;
    }
    editOptional(componentType, edit) {
        const component = this.getOptional(componentType);
        if (!component) {
            return this;
        }
        edit(component);
        return this;
    }
    add(...componentTypes) {
        const addedComponents = this.#addWithDependencies(...componentTypes);
        this.onChange.emit(new ComponentsChangeEvent(addedComponents, []));
        return this;
    }
    remove(componentType) {
        const removedComponents = this.#removeWithDependents(componentType);
        this.onChange.emit(new ComponentsChangeEvent([], removedComponents));
        return this;
    }
    #addWithDependencies(...componentTypes) {
        const dependencies = new Set(componentTypes.flatMap((componentType) => componentType.dependencies ?? []));
        const addedDependencyComponents = dependencies.size > 0 ? this.#addWithDependencies(...dependencies) : [];
        const newComponents = componentTypes
            .filter((componentType) => !this.#components.has(componentType))
            .map((componentType) => new componentType());
        newComponents.forEach((component) => {
            this.#components.set(component.constructor, component);
        });
        return addedDependencyComponents.concat(newComponents);
    }
    #removeWithDependents(...componentTypes) {
        const dependents = new Set(componentTypes.flatMap((componentType) => Array.from(this.#components.keys()).filter((otherComponentType) => componentType.dependencies?.includes(otherComponentType))));
        const oldComponents = componentTypes
            .map((componentType) => this.#components.get(componentType))
            .filter((component) => component !== undefined);
        oldComponents.forEach((component) => {
            this.#components.delete(component.constructor);
        });
        const removedDependentComponents = dependents.size > 0 ? this.#removeWithDependents(...dependents) : [];
        return oldComponents.concat(removedDependentComponents);
    }
}
