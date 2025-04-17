import Debugger from "../Debugger.js";

import Obstacle from "./Obstacle.js";
import Platform from "./Platform.js";
import Pillar from "./Pillar.js";

import Microphone from "../Mic.js";
import FrequencyCalculator from "../FrequencyCalculator.js";
import Time from "../Time.js";

// min and max Y are offsets based on platform Y

export default class PathObstacle extends Obstacle {
    #freqCalculator = undefined;
    #camera = undefined;
    #resetKey = undefined;

    #resetText = undefined;
    #platform = undefined;
    #pillars = []; 
    #nrPillars = 0;
    #isActive = false;
    
    #pillarTime = 0;

    #pathCenter = {x: 0, y:0 };
    #minY = 0;
    #maxY = 0;
    #currentPillarIdx = 0;

    constructor(scene, x, y, pillarStartX, width, minY = -300, maxY = 300)
    {
        const margin = 50;
        super(x - margin, x + margin, 0.4, 0);

        this.#freqCalculator = new FrequencyCalculator();
        this.#camera = scene.cameras.main;


        Debugger.log(scene.input.keyboard);
        this.#resetKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        Debugger.log(this.#resetKey);


        this.#minY = y - minY;
        this.#maxY = y - maxY;
        this.#pathCenter = { x: pillarStartX + width / 2, y: this.#calcY(0.5) }

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

        // Move all pillars back down
        this.#pillars.forEach(pillar => pillar.y = this.#minY);
        this.#currentPillarIdx = 0;
        this.#pillarTime = 0;
        this.#freqCalculator.clear();
    }

    update(player) {
       
         // Move pillars up and down
         this.#pillars.forEach(pillar => pillar.update());

        if (!this.isInRange(player.x))
            return;

        if (this.finished) {
            if (this.#resetKey.isDown)
                this.reset();
            return;
        }

        if (this.#currentPillarIdx === this.#pillars.length) {
            // Pan all the time to keep camera there
            const panTime = 1000;
            this.#camera.pan(player.x + this.#camera.followOffset.x,  player.y - this.#camera.followOffset.y, panTime)

            const pillar = this.#pillars[this.#pillars.length - 1];
            if (!pillar.isMoving) {
                Debugger.log("Deactivate path");
    
                player.setState('idle');
                this.finish();
            }

            return;
        }

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
        const panTime = 1000;
        this.#camera.pan(this.#pathCenter.x, this.#pathCenter.y, panTime)
        
        if (!this.isLeveled())
            return;
        
        // Move pillar one by one
        const pillar = this.#pillars[this.#currentPillarIdx];
        const calculationTime = 0.05;
        if (this.#pillarTime > calculationTime) {
            // Get frequency and place pillar to that height
            const mic = Microphone.instance;
            const freq = this.#freqCalculator.averageFreq;
            const ratio = (freq - mic.lowFreq) / (mic.highFreq - mic.lowFreq);
            pillar.y = this.#calcY(min(ratio, 1));

            this.#pillarTime = 0;
            this.#freqCalculator.clear();
            ++this.#currentPillarIdx;
        } else {
            this.#freqCalculator.sample();
            this.#pillarTime += Time.deltaTime;
        }
    }

    #calcY(ratio) {
        const dist = this.#maxY - this.#minY;
        return this.#minY + dist * ratio;
    }
}