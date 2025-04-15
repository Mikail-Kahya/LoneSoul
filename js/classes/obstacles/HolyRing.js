import Obstacle from "./Obstacle.js";
import Platform from "./Platform.js";
import Time from "../Time.js";
import Microphone from "../Mic.js";
import FrequencyCalculator from "../FrequencyCalculator.js";
import Debugger from "../Debugger.js";

// TODO ADD HIGH PITCH CALIBRATION HERE

export default class HolyRing extends Obstacle {
    #ring = undefined;
    #platform = undefined;
    #frequencyCalculator = undefined;
    

    constructor(scene, posX, posY)
    {
        posX -= 2000;
        super(posX - 50, posX + 50, 0, 0);

        this.#frequencyCalculator = new FrequencyCalculator();
        this.#platform = new Platform(scene, posX, posY);


        // Create holy ring
        const ringOffsetY = -240;
        const ringName = 'ring';
        this.#ring = scene.matter.add.sprite(posX, this.floorY + ringOffsetY, ringName, null, { shape: scene.mapPhysics.holyRing, label: ringName });
        this.#ring.setCollisionCategory(null); // Deactivate to start
        this.#ring.alpha = 0;
    }

    update(player) {
        if (!this.shouldUpdate(player.x))
        {
            return;    
        }

        if (this.#platform.onPlatform)
            player.setState('fly');
    }

    test() {
        Debugger.log(this);
    }
}