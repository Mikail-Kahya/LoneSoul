import Debugger from "../Debugger.js";
import Time from "../Time.js";
import SpriteCrafter from "../SpriteCrafter.js";


// Platform that the player can stand on
export default class HolyRing {
    #ring = undefined;
    #dir = 0;
    #fadeRate = 2; // how much alpha per second [0 - 1]
    #collisionThreshold = 0.5;
    #isActive = true;
    #disappearTime = 0;
    
    get isActive() {
        return this.#isActive;
    }

    get sprite() {
        return this.#ring;
    }

    constructor(scene, posX, posY) {
        // Create platform to activate on
        const ringName = 'ring';
        this.#ring = scene.matter.add.sprite(posX, posY - height, ringName, null, { shape: scene.mapPhysics.holyRing, label: SpriteCrafter.floorLabel });
        this.#ring.setCollisionCategory(null); // Deactivate to start
        this.#ring.alpha = 0;

        scene.matter.world.on(`collisionstart`, (event, bodyA, bodyB) => {
            if (bodyB.parent.label !== `player`)
                return;

            if (bodyA.parent === this.#ring.body)
                this.appear();
        });

        scene.matter.world.on(`collisionend`, (event, bodyA, bodyB) => {
            if (bodyB.parent.label !== `player`)
                return;

            if (bodyA.parent === this.#ring.body)
                this.disappear();
        });
    }

    update() {
        const delay = 1;
        if (this.#dir == 1)
            this.#fadeIn();
        else if (this.#disappearTime > delay)
            this.#fadeOut();
        else
            this.#disappearTime += Time.deltaTime;
    }

    appear() {
        this.#dir = 1;
    }

    disappear() {
        this.#dir = -1;
        this.#disappearTime = 0;
    }

    #fadeIn() {
        this.#ring.alpha += Time.deltaTime * this.#fadeRate;
        if (this.#ring.alpha > this.#collisionThreshold)
        {
            this.#ring.setCollisionCategory(1);
            this.#isActive = true;
        }
    }

    #fadeOut() {
        this.#ring.alpha -= Time.deltaTime * this.#fadeRate;
        if (this.#ring.alpha < this.#collisionThreshold)
        {
            this.#ring.setCollisionCategory(null);
            this.#isActive = false;
        }
    }
}