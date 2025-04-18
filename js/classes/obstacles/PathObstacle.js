import Debugger from "../Debugger.js";

import Obstacle from "./Obstacle.js";
import Platform from "./Platform.js";
import Pillar from "./Pillar.js";

import Microphone from "../Mic.js";
import Time from "../Time.js";
import SpriteCrafter from "../SpriteCrafter.js";
import FrequencyCalculator from "../FrequencyCalculator.js";

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
        const margin = 100;
        super(x - margin, x + width + margin, 0.4, 0);

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
        const textOffsetY = 50;
        this.#resetText = SpriteCrafter.addText(this.#pathCenter.x, this.#minY + textOffsetY, 'Press R to reset', 'black');
        this.#resetText.setVisible(false);

        
        if(true)
        {
            Microphone.instance.lowFreq = 100;
            Microphone.instance.highFreq = 500;
        }
    }

    reset() {
        super.reset();
        
        // Move all pillars back down
        this.#pillars.forEach(pillar => pillar.y = this.#minY);
        
        // Reset variables
        this.#isActive = false;
        this.#currentPillarIdx = 0;
        this.#pillarTime = 0;
        this.#freqCalculator.clear();
        this.#resetText.setVisible(false);
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
        
        if (!this.#isActive)
        {
            this.#activate(player);
            return;
        }

        if(this.#isAtEnd())
        {
            // Transition State
            // --- Pan back to the player
            const playerPos = { 
                x: player.x + this.#camera.followOffset.x,
                y: player.y - this.#camera.followOffset.y
            };
            this.#panTo(playerPos);
            this.#finishPath(player);
        } else {
            // Building state
            // --- Pan to obstacle
            this.#panTo(this.#pathCenter);
            if (this.isLeveled())
                this.#adjustPath();   
        }

         
    }

    #calcY(ratio) {
        const dist = this.#maxY - this.#minY;
        return this.#minY + dist * ratio;
    }

    #panTo(pos) {
        // Pan all the time to keep camera there
        const panTime = 1000;
        this.#camera.pan(pos.x, pos.y, panTime)
    }

    #isAtEnd() {
        return this.#currentPillarIdx === this.#pillars.length;
    }

    #activate(player) {
        // Activates once on platform activation
        const shouldActivate = this.#platform.onPlatform && !this.#isActive;
        if (!shouldActivate)
            return;

        this.#isActive = true;
        player.setState('fly');   
    }

    #adjustPath() {
        // Move pillar one by one
        const pillar = this.#pillars[this.#currentPillarIdx];
        const calculationTime = 0.05;
        if (this.#pillarTime > calculationTime) {
            // Get frequency and place pillar to that height
            const mic = Microphone.instance;
            const freq = this.#freqCalculator.averageFreq;
            const ratio = (freq - mic.lowFreq) / (mic.highFreq - mic.lowFreq);
            pillar.y = this.#calcY(Math.clamp(ratio, 0, 1));

            this.#pillarTime = 0;
            this.#freqCalculator.clear();
            ++this.#currentPillarIdx;
        } else {
            this.#freqCalculator.sample();
            this.#pillarTime += Time.deltaTime;
        }
    }

    #finishPath(player) {
        // Finish once the last pillar finished
        const lastPillar = this.#pillars[this.#pillars.length - 1];
        this.#resetText.setVisible(true);
        if (!lastPillar.isMoving) {
            player.setState('idle');
            this.finish();
        }
    }
}