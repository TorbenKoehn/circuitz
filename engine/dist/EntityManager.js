import Entity from './Entity.js';
import { Event, SetEventSource } from './Event.js';
export class EntityManagerChangeEvent extends Event {
    entityManager;
    addedEntities;
    removedEntities;
    constructor(entityManager, addedEntities, removedEntities) {
        super();
        this.entityManager = entityManager;
        this.addedEntities = addedEntities;
        this.removedEntities = removedEntities;
    }
}
export class Query {
    matches;
    constructor(matches) {
        this.matches = matches;
    }
}
export default class EntityManager {
    changeEvent = new SetEventSource();
    entityChangeEvent = new SetEventSource();
    #nextId = 0;
    #entities = new Map();
    #entityChangeListeners = new Map();
    #queryMatches = new Map();
    get entities() {
        return Array.from(this.#entities.values());
    }
    has(id) {
        return this.#entities.has(id);
    }
    get(id) {
        return this.#entities.get(id);
    }
    match(query) {
        const existingMatches = this.#queryMatches.get(query);
        if (existingMatches) {
            return existingMatches;
        }
        const initialMatches = new Set(this.#entities.values().filter(query.matches));
        this.#queryMatches.set(query, initialMatches);
        return initialMatches;
    }
    add(...componentTypes) {
        const id = this.#nextId++;
        const entity = new Entity(id);
        entity.add(...componentTypes);
        const listener = (event) => {
            for (const [query, matches] of this.#queryMatches.entries()) {
                const match = query.matches(entity);
                if (match && !matches.has(entity)) {
                    matches.add(entity);
                }
                else if (!match && matches.has(entity)) {
                    matches.delete(entity);
                }
            }
            this.entityChangeEvent.emit(event);
        };
        entity.onChange.addListener(listener);
        this.#entityChangeListeners.set(id, listener);
        this.#entities.set(id, entity);
        for (const [query, matches] of this.#queryMatches.entries()) {
            if (query.matches(entity)) {
                matches.add(entity);
            }
        }
        this.changeEvent.emit(new EntityManagerChangeEvent(this, [entity], []));
        return entity;
    }
    remove(entity) {
        const listener = this.#entityChangeListeners.get(entity.id);
        if (listener) {
            entity.onChange.removeListener(listener);
            this.#entityChangeListeners.delete(entity.id);
        }
        for (const matches of this.#queryMatches.values()) {
            if (matches.has(entity)) {
                matches.delete(entity);
            }
        }
        this.#entities.delete(entity.id);
        this.changeEvent.emit(new EntityManagerChangeEvent(this, [], [entity]));
    }
}
