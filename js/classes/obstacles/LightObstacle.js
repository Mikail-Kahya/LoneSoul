import Debugger from "../Debugger.js";

import Obstacle from "./Obstacle.js";

import Microphone from "../Mic.js";
import Time from "../Time.js";
import SpriteCrafter from "../SpriteCrafter.js";

export default class LightObstacle extends Obstacle {
    #image = undefined;

    constructor(scene, centerX, centerY, width) {
        super(centerX - width / 2, centerX + width / 2, 0.1, 0);

        this.#image = scene.add.image(centerX, centerY, `caveDarkness`);
        this.#image.depth = SpriteCrafter.foregroundZ;
    }

    update(player) {
        const fadeStrength = 0.2;
        const freqRatio = Math.max(Microphone.instance.freqRatio * 2, 0.5);  // Never go close to 0
        const fadeRate = this.shouldUpdate(player.x) ? -fadeStrength * freqRatio : fadeStrength; // Reduce darkness when allowing to update
        const deltaTime = Time.deltaTime;

        this.#image.alpha = Math.clamp(this.#image.alpha + fadeRate * deltaTime, 0, 1);
    }
}