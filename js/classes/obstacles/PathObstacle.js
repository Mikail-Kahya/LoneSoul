import Debugger from "../Debugger.js";

import Obstacle from "./Obstacle.js";
import Platform from "./Platform.js";
import Pillar from "./Pillar.js";

import Microphone from "../Mic.js";

// min and max Y are offsets based on platform Y

export default class PathObstacle extends Obstacle {
    #camera = undefined;

    #resetText = undefined;
    #platform = undefined;
    #pillars = []; 
    #nrPillars = 0;
    #isActive = false;
    #swapPillar = true;

    #pathCenter = {x: 0, y:0 };
    #minY = 0;
    #maxY = 0;
    #currentPillarIdx = 0;

    constructor(scene, x, y, pillarStartX, width, minY = -300, maxY = 300)
    {
        const margin = 50;
        super(x - margin, x + margin, 0.4, 0);

        this.#camera = scene.cameras.main;
        this.#minY = y - minY;
        this.#maxY = y - maxY;
        //this.#pathCenter = { x: pillarStartX + width / 2, y: (this.#maxY - this.#minY) / 2 + this.#minY }
        this.#pathCenter = { x: pillarStartX + width / 2, y: this.#minY }

        this.#platform = new Platform(scene, x, y);
        this.#nrPillars = Math.ceil(width / Pillar.width);
        this.#pillars.length = this.#nrPillars;
        for (let idx = 0; idx < this.#nrPillars; ++idx)
            this.#pillars[idx] = new Pillar(scene, pillarStartX + idx * Pillar.width, this.#minY);

        // Create text
        //const textOffsetY = 20;
        //this.#tutorialText = SpriteCrafter.addText(posX, posY + textOffsetY, 'Use your low voice to fly');
        //this.#tutorialText.setVisible(false);

        if(true)
        {
            Microphone.instance.lowFreq = 100;
            Microphone.instance.highFreq = 500;
        }
    }

    reset() {
        super.reset();
        
        this.#isActive = false;
        Debugger.log("Reset the obstacle");
    }

    update(player) {
        if (!this.isInRange(player.x) || this.finished)
            return;

        // Move pillars when player is in range
        this.#pillars.forEach(pillar => pillar.update());

        // Activates once on platform activation
        if (this.#platform.onPlatform && !this.#isActive) {
            Debugger.log("Activate path");

            this.#isActive = true;
            player.setState('fly');
            //this.#tutorialText.setVisible(true);       
        }

        if (!this.#isActive)
            return;

        // Pan all the time to keep camera there
        this.#camera.pan(this.#pathCenter.x, this.#pathCenter.y, 1000)
        
        if (!this.isLeveled())
            return;
        
        // Move pillar one by one
        const pillar = this.#pillars[this.#currentPillarIdx];

        if (this.#swapPillar) {
            pillar.y = this.#calcY();
            this.#swapPillar = false;
        }
        
        if (!this.#swapPillar && !pillar.isMoving) {
            ++this.#currentPillarIdx;
            this.#swapPillar = true;
        }


        if (this.#currentPillarIdx == this.#pillars.length) {
            Debugger.log("Deactivate path");

            player.setState('idle');
            this.finish();
        }
    }

    #calcY() {
        const ratio = min(Microphone.instance.freqRatio, 1);
        const dist = this.#maxY - this.#minY;
        return this.#minY + dist * ratio;
    }
}