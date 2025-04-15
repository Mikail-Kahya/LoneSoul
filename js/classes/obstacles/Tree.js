import Obstacle from "./Obstacle.js";
import Time from "../Time.js";
import Microphone from "../Mic.js";

// TODO ADD HIGH PITCH CALIBRATION HERE

export default class Tree extends Obstacle {
    #sprite = undefined;
    #invisibleWall = undefined;
    #fallingSpeed = 10;
    #startAngle = 10;
    #shakeDir = 1;

    constructor(scene, posX, posY)
    {
        super(posX - 150, posX + 1000, 0.05, 0);
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

    update(posX) {
        if (!this.shouldUpdate(posX))
        {
            if (this.finished)
                this.#fall();
            return;    
        }
        this.#shake();
        if (Microphone.instance.freqRatio > 0.7)
            this.finish();
    }

    #shake() {
        const angleSwapThreshold = 2;
        const shakeSpeed = 50;

        const scaler = Microphone.instance.freqRatio * Time.deltaTime;
        let newAngle = this.#sprite.angle + shakeSpeed * this.#shakeDir * scaler
        
        if (Math.abs(newAngle - this.#startAngle) > angleSwapThreshold)
        {
            this.#shakeDir *= -1;
            newAngle = this.#sprite.angle + shakeSpeed * this.#shakeDir * scaler
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