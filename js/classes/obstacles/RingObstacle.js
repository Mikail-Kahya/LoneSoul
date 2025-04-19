import Debugger from "../Debugger.js";

import Obstacle from "./Obstacle.js";
import Platform from "./Platform.js";
import HolyRing from "./HolyRing.js";

import Microphone from "../Mic.js";
import SpriteCrafter from "../SpriteCrafter.js";
import FrequencyCalculator from "../FrequencyCalculator.js";

export default class RingObstacle extends Obstacle {
    #ring = undefined;
    #platform = undefined;
    #isActive = false;
    #tutorialText = undefined;
    #frequencyCalculator = undefined;
    

    constructor(scene, posX, posY, height)
    {
        super(posX - 50, posX + 50, 0, 0);

        this.#frequencyCalculator = new FrequencyCalculator();
        this.#platform = new Platform(scene, posX, posY);


        // Create holy ring
        this.#ring = new HolyRing(scene, posX, posY - height);

        // Create text
        const textOffsetY = 20;
        this.#tutorialText = SpriteCrafter.addText(posX, posY + textOffsetY, 'Use your low voice to fly');
        this.#tutorialText.setVisible(false);
    }

    reset() {
        super.reset();
        
        this.#isActive = false;
        this.#frequencyCalculator.clear();
        this.#tutorialText.setVisible(false);
        Debugger.log("Reset the rings");
    }

    update(player) {
        this.#ring.update();
        if (!this.#ring.isActive && this.finished)
            this.reset();

        if (!this.shouldUpdate(player.x))
            return;    

        if (this.#platform.onPlatform && !this.#isActive) {
            this.#isActive = true;
            player.setState('fly');
            this.#tutorialText.setVisible(true);
        }

        if (!this.#isActive)
            return;

        if (this.#rise(player)) {
            this.#frequencyCalculator.sample();
            this.#checkRing(player);
        }

    }

    #rise(player) {
        const mic = Microphone.instance;
        const riseLevelThreshold = 0.5;
        const riseSpeed = 1;
        const fallSpeed = 0.1;
        if (mic.level < riseLevelThreshold || mic.highFreq < mic.freq) {
            player.setVelocityY(fallSpeed);
            return false;
        }

        player.setVelocityY(-riseSpeed);
        return true;
    }

    #checkRing(player) {
        const gap = 40;
        if (player.y > this.#ring.sprite.y - gap)
            return;

        this.finish();
        this.#isActive = false;
        player.setState('idle');
        this.#ring.appear();
        Microphone.instance.lowFreq = this.#frequencyCalculator.averageFreq;
    }
}