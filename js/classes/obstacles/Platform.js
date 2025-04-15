import Debugger from "../Debugger.js";


// Platform that the player can stand on
export default class platform {
    #triggerBox = undefined;
    #isOnPlatform = false;

    get onPlatform() {
        return this.#isOnPlatform;
    }

    constructor(scene, posX, posY) {
        // Create platform to activate on
        const platformName = 'platform';
        
        const platformSprite = scene.matter.add.sprite(posX, posY, platformName, null, { shape: scene.mapPhysics.mapGroundPlatform, label: `floor` });
        platformSprite.setOrigin(0.5, 1);

        const triggerOffsetY = -23.5;
        this.#triggerBox = scene.matter.add.sprite(posX, posY + triggerOffsetY, null, null, { shape: scene.mapPhysics.mapGroundPlatformActivation, label: platformName });
        this.#triggerBox.setVisible(true);

        scene.matter.world.on(`collisionstart`, (event, bodyA, bodyB) => {
            if (bodyB.parent.label !== `player`)
                return;

            if (bodyA.parent === this.#triggerBox.body)
                this.#isOnPlatform = true;
        });

        scene.matter.world.on(`collisionend`, (event, bodyA, bodyB) => {
            if (bodyB.parent.label !== `player`)
                return;

            if (bodyA.parent === this.#triggerBox.body)
                this.#isOnPlatform = false;
        });
    }
}