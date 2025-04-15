import Obstacle from "./Obstacle.js";
import Time from "../Time.js";
import Microphone from "../Mic.js";
import FrequencyCalculator from "../FrequencyCalculator.js";
import Debugger from "../Debugger.js";

// TODO ADD HIGH PITCH CALIBRATION HERE

export default class Tree extends Obstacle {
    #sprite = undefined;
    #invisibleWall = undefined;
    #fallingSpeed = 10;
    #startAngle = 10;
    #shakeDir = 1;
    #shakeTime = 2; // seconds of shaking and calibrating
    #elapsedShakeTime = 0;
    #frequencyCalculator = undefined;
    

    constructor(scene, posX, posY)
    {
        super(posX - 150, posX + 1000, 0.05, 0);

        this.#frequencyCalculator = new FrequencyCalculator();

        const name = 'treeObstacle';
        const invisOffsetY = -130;
        console.log(scene);
        
        this.#sprite = scene.add.image(posX, posY, name).setOrigin(0.5, 1).setAngle(this.#startAngle);
        this.#invisibleWall = scene.matter.add.sprite(posX, posY + invisOffsetY, null, null, { shape: scene.mapPhysics.mapStartWall }).setVisible(false);
        // Path after the trees fall
        const pathOffsetX = 250;
        const pathOffsetY = 10;
        const pathAngle = 89;
        scene.matter.add.sprite(posX + pathOffsetX, posY + pathOffsetY, null, null, 
                                { shape: scene.mapPhysics.treeObstacle, label: `floor` }).setAngle(pathAngle).setVisible(false);
    }

    update(player) {
        if (!this.shouldUpdate(player.x))
        {
            if (this.finished)
                this.#fall();
            //else
            //    this.#elapsedShakeTime = 0;
            return;    
        }


        this.#shake();
        this.#elapsedShakeTime += Time.deltaTime;
        this.#frequencyCalculator.sample();
        if (this.#elapsedShakeTime > this.#shakeTime)
        {
            this.finish();
            Microphone.instance.highFreq = this.#frequencyCalculator.averageFreq;
            Debugger.log(`High frequency: ${this.#frequencyCalculator.averageFreq}`);
        }
    }

    #shake() {
        const angleSwapThreshold = 2;
        const shakeSpeed = 50;

        const angleStep = Time.deltaTime * shakeSpeed;
        let newAngle = this.#sprite.angle + angleStep * this.#shakeDir;
        
        if (Math.abs(newAngle - this.#startAngle) > angleSwapThreshold)
        {
            this.#shakeDir *= -1;
            newAngle = this.#sprite.angle + angleStep * this.#shakeDir;
        }

        this.#sprite.angle = newAngle;
    }

    #fall() {
        this.finish();

        const deltaTime = Time.deltaTime;
        const fallingAccel = 50;
        const endFallAngle = 88;
        if (this.#sprite.angle < endFallAngle) {
            this.#sprite.angle += this.#fallingSpeed * deltaTime;
            this.#fallingSpeed += fallingAccel * deltaTime; 
        }

        // Removes invis wall
        const invisAngleThreshold = 80;
        if (this.#sprite.angle > invisAngleThreshold)
            this.#invisibleWall.destroy();
    }
}