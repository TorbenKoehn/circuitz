import Render2 from '../../components/Render2.js';
import Circle from '../../geometry/Circle.js';
import Line from '../../geometry/Line.js';
import { Path } from '../../geometry/Path.js';
import { Arc } from '../../geometry/paths/segments/Arc.js';
import { ArcTo } from '../../geometry/paths/segments/ArcTo.js';
import { BezierCurveTo } from '../../geometry/paths/segments/BezierCurveTo.js';
import { Close } from '../../geometry/paths/segments/Close.js';
import { LineTo } from '../../geometry/paths/segments/LineTo.js';
import { MoveTo } from '../../geometry/paths/segments/MoveTo.js';
import { QuadraticCurveTo } from '../../geometry/paths/segments/QuadraticCurveTo.js';
import Polygon from '../../geometry/Polygon.js';
import Rectangle from '../../geometry/Rectangle.js';
import { Transform2Matrix, } from '../../geometry/Transform2Matrix.js';
import { logOnce, logTwice } from '../../util/logging.js';
export class RenderTarget {
}
export class CanvasRenderTarget extends RenderTarget {
    canvas;
    context;
    #autoMaximizeListener = undefined;
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.context = this.extractContext(this.canvas);
    }
    maximize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        return this;
    }
    autoMaximize() {
        if (this.#autoMaximizeListener) {
            return this;
        }
        this.#autoMaximizeListener = () => this.maximize();
        addEventListener('resize', this.#autoMaximizeListener);
        return this.maximize();
    }
}
export class Canvas2RenderTarget extends CanvasRenderTarget {
    extractContext(canvas) {
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D rendering context');
        }
        return context;
    }
    render(root) {
        logTwice(`Canvas2RenderTarget.render(${root.entity.id})`, 'Rendering to canvas', root, this.canvas.width, this.canvas.height);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.lineWidth = 1;
        const viewport = Rectangle.of(0, 0, this.canvas.width, this.canvas.height);
        this.#renderNode(root, Transform2Matrix.identity(), viewport);
    }
    #renderNode(node, matrix, viewport) {
        const renderMatrix = Transform2Matrix.multiply(matrix, node.component.matrix);
        const render2 = node.entity.getOptional(Render2);
        if (render2) {
            if (!render2.visible) {
                return;
            }
            const target = render2.target;
            const geometry = render2.geometry;
            const style = render2.style;
            if (target && target !== this) {
                // This entity has an own render target.
                // This allows "off-canvasing" single elements and its children
                // The matrix will be reset at this point
                target.render(node);
                // Depending on the compatibility of the target we can render the resulting context here.
                if (target instanceof CanvasRenderTarget) {
                    const resultCanvas = target.canvas;
                    const resultBounds = Rectangle.of(0, 0, resultCanvas.width, resultCanvas.height);
                    const targetPath = renderMatrix.projectRectangle(resultBounds);
                    const targetBounds = targetPath.calculateBounds();
                    if (targetBounds.intersectsRect(viewport)) {
                        this.context.setTransform(renderMatrix.a, renderMatrix.b, renderMatrix.c, renderMatrix.d, renderMatrix.e, renderMatrix.f);
                        this.context.drawImage(resultCanvas, 0, 0);
                        this.context.resetTransform();
                    }
                }
            }
            else if (geometry) {
                const transformedPath = this.#projectGeometry(geometry, renderMatrix);
                const bounds = transformedPath.calculateBounds();
                logOnce(`Canvas2RenderTarget.renderNode(${node.entity.id})`, transformedPath.toString(), bounds.toString());
                if (bounds.intersectsRect(viewport)) {
                    this.#drawPath(transformedPath);
                    if (style?.fillColor) {
                        this.context.fillStyle = style.fillColor;
                        this.context.fill();
                    }
                    if (style?.strokeColor) {
                        this.context.strokeStyle = style.strokeColor;
                        this.context.stroke();
                    }
                }
            }
        }
        for (const child of node.children) {
            logOnce(`Canvas2RenderTarget.renderChildren(${node.entity.id})`);
            this.#renderNode(child, renderMatrix, viewport);
        }
    }
    #drawPath(path) {
        for (const segment of path.segments) {
            if (segment instanceof MoveTo) {
                this.context.moveTo(segment.targetX, segment.targetY);
            }
            if (segment instanceof LineTo) {
                this.context.lineTo(segment.targetX, segment.targetY);
            }
            if (segment instanceof QuadraticCurveTo) {
                this.context.quadraticCurveTo(segment.controlX, segment.controlY, segment.targetX, segment.targetY);
            }
            if (segment instanceof BezierCurveTo) {
                this.context.bezierCurveTo(segment.control1X, segment.control1Y, segment.control2X, segment.control2Y, segment.targetX, segment.targetY);
            }
            if (segment instanceof ArcTo) {
                this.context.arcTo(segment.controlX, segment.controlY, segment.targetX, segment.targetY, segment.radius);
            }
            if (segment instanceof Arc) {
                this.context.arc(segment.centerX, segment.centerY, segment.radius, segment.startAngle, segment.endAngle);
            }
            if (segment instanceof Close) {
                this.context.closePath();
            }
        }
    }
    #projectGeometry(geometry, matrix) {
        if (geometry instanceof Rectangle) {
            return matrix.projectRectangle(geometry);
        }
        if (geometry instanceof Circle) {
            return matrix.projectCircle(geometry);
        }
        if (geometry instanceof Line) {
            return matrix.projectLine(geometry);
        }
        if (geometry instanceof Polygon) {
            return matrix.projectPolygon(geometry);
        }
        if (geometry instanceof Path) {
            return matrix.projectPath(geometry);
        }
        throw new Error(`Tried to project unsupported shape type ${geometry.constructor.name}`);
    }
}
