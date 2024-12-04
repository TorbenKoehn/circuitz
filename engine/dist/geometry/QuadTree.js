import Rectangle from './Rectangle.js';
export class QuadTreeNode {
    bounds;
    capacity;
    #children = { type: 'rectangles', rectangles: [] };
    constructor(bounds, capacity) {
        this.bounds = bounds;
        this.capacity = capacity;
    }
    add(rect) {
        if (!this.bounds.intersectsRect(rect)) {
            // Rectangle is not in the boundary
            return false;
        }
        if (this.#children.type === 'rectangles') {
            // Node is not subdivided yet
            if (this.#children.rectangles.length < this.capacity) {
                // Capacity not reached yet, just add it
                this.#children.rectangles.push(rect);
                return true;
            }
            // Capacity is reached, subdivide
            // Will trigger the block below, too
            this.subdivide();
        }
        // Try inserting into children
        if (this.#children.type === 'quadrants') {
            for (const quadrant of this.#children.quadrants) {
                if (!quadrant.bounds.intersectsRect(rect)) {
                    continue;
                }
                return quadrant.add(rect);
            }
        }
        // No child can contain the rectangle, can't insert
        // This shouldn't ever happen
        return false;
    }
    select(rect) {
        if (!this.bounds.intersectsRect(rect)) {
            return []; // Empty array if rectangle doesn't intersect
        }
        const results = [];
        if (this.#children.type === 'rectangles') {
            for (const rect of this.#children.rectangles) {
                if (rect.intersectsRect(rect)) {
                    results.push(rect); // Add rectangles within the range
                }
            }
        }
        if (this.#children.type === 'quadrants') {
            for (const quadrant of this.#children.quadrants) {
                results.push(...quadrant.select(rect));
            }
        }
        return results;
    }
    subdivide() {
        if (this.#children.type === 'quadrants') {
            // Already divided
            return;
        }
        const { x, y, width, height } = this.bounds;
        const nw = Rectangle.of(x, y, width / 2, height / 2);
        const ne = Rectangle.of(x + width / 2, y, width / 2, height / 2);
        const sw = Rectangle.of(x, y + height / 2, width / 2, height / 2);
        const se = Rectangle.of(x + width / 2, y + height / 2, width / 2, height / 2);
        const rects = this.#children.rectangles;
        this.#children = {
            type: 'quadrants',
            quadrants: [
                new QuadTreeNode(nw, this.capacity),
                new QuadTreeNode(ne, this.capacity),
                new QuadTreeNode(sw, this.capacity),
                new QuadTreeNode(se, this.capacity),
            ],
        };
        for (const rect of rects) {
            this.add(rect);
        }
    }
    clear() {
        this.#children = { type: 'rectangles', rectangles: [] };
    }
}
export default class QuadTree {
    rootNode;
    constructor(boundary, capacity) {
        this.rootNode = new QuadTreeNode(boundary, capacity);
    }
    add(rect) {
        return this.rootNode.add(rect);
    }
    select(rect) {
        return this.rootNode.select(rect);
    }
    clear() {
        this.rootNode.clear();
    }
}
