import ComponentContainer from './ComponentContainer.js';
import { SetEventSource } from './Event.js';
export class EntityChangeEvent {
    entity;
    addedComponents;
    removedComponents;
    constructor(entity, addedComponents, removedComponents) {
        this.entity = entity;
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
export default class Entity {
    id;
    onComponentsChange = new SetEventSource();
    onChange = new SetEventSource();
    #components = new ComponentContainer();
    constructor(id) {
        this.id = id;
    }
    has(componentType) {
        return this.#components.has(componentType);
    }
    get(componentType) {
        return this.#components.get(componentType);
    }
    getOptional(componentType) {
        return this.#components.getOptional(componentType);
    }
    edit(componentType, edit) {
        this.#components.edit(componentType, edit);
        return this;
    }
    editOptional(componentType, edit) {
        this.#components.editOptional(componentType, edit);
        return this;
    }
    add(...componentTypes) {
        this.#components.onChange.addListener(this.#onComponentsChange);
        this.#components.add(...componentTypes);
        this.#components.onChange.removeListener(this.#onComponentsChange);
        return this;
    }
    remove(componentType) {
        this.#components.onChange.addListener(this.#onComponentsChange);
        this.#components.remove(componentType);
        this.#components.onChange.removeListener(this.#onComponentsChange);
        return this;
    }
    #onComponentsChange = (event) => {
        this.onComponentsChange.emit(event);
        this.onChange.emit(new EntityChangeEvent(this, event.addedComponents, event.removedComponents));
    };
}
