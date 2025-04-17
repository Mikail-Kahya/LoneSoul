import Debugger from "../Debugger.js";
import Time from "../Time.js";
import SpriteCrafter from "../SpriteCrafter.js";


// Pillar that rises
// Always lerps to the new Y position
export default class Pillar {
    #sprite = undefined;
    static #width = 7;
    static #height = 1001;

    #newY = 0;
    #isMoving = false;

    static get width() {
        return this.#width;
    }

    static get height() {
        return this.#height;
    }

    get sprite() {
        return this.#sprite;
    }

    get isMoving() {
        return this.#isMoving;
    }

    set y(y) {
        return this.#newY = y + Pillar.#height / 2;
    }

    constructor(scene, x, y) {
        this.y = y;
        // Create platform to activate on
        const pillarName = 'pillarObstacle';
        const floorLabel = 'floor';
        this.#sprite = SpriteCrafter.addSprite(pillarName, x, this.#newY, 0, scene.mapPhysics.pillarObstacle, floorLabel);
        this.#sprite.setOrigin(0.5, 0.5);
    }

    update() {
        const distance = this.#newY - this.#sprite.y;
        if (Math.abs(distance) > 0.05)
            this.#sprite.y += distance * Time.deltaTime;

        const movingMargin = 40;
        this.#isMoving = Math.abs(distance) > movingMargin;
    }
}