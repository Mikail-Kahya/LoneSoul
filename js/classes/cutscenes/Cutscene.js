import Time from "../Time.js";
import SpriteCrafter from "../SpriteCrafter.js";
import Debugger from "../Debugger.js";

// Obstacles found in the world

export default class Cutscene {
    #sprite = undefined;
    #trigger = { x: 0, width: 0 };
    #id = 'none';
    #playTime = 0;
    #shouldFadePlayer = false;
    #isPlaying = false;
    #isDone = false;

    get isDone() {
        return this.#isDone;
    }

    constructor(scene,pos = {x: 0, y: 0}, trigger = {x: 0, width: 0}, id = 'none', anim = {start: 0, end: 0, frameRate: 12}, shouldFadePlayer = true) { // Adjust if in the future continued to also work with y
        this.#sprite = SpriteCrafter.addSprite(id, pos.x, pos.y, 0, null, null, true);
        this.#sprite.setStatic(true);
        scene.anims.create({
            key: id,
            frames: scene.anims.generateFrameNumbers(id, {
                start: anim.start,
                end: anim.end
            }),
            frameRate: anim.frameRate
        })

        this.#trigger.x = trigger.x;
        this.#trigger.width = trigger.width;
        this.#id = id;
        this.#shouldFadePlayer = shouldFadePlayer;

        // Calculate anim playTim
        const nrFrames = anim.end - anim.start;
        this.#playTime = nrFrames / anim.frameRate;
    }

    update(player) {
        if (this.#isDone)
            return;
        if (!this.#isTriggered(player.x))
            return;
        if (!this.#isPlaying)
            this.#play(player);
    }

    #play(player) {
        player.disableInput();
        player.setIgnoreGravity(true);
        if (this.#shouldFadePlayer && !this.#fadePlayer(player))
            return; 

        this.#isPlaying = true;
        this.#sprite.anims.play(this.#id, false);

        Debugger.log(`End after ${this.#playTime} seconds`);
        setTimeout(() => {
            Debugger.log(this);
            this.#isDone = true;
        }, this.#playTime * 1000);
    }

    #fadePlayer(player) {
        const fadeRate = 1000;
        const deltaFade = -fadeRate * Time.deltaTime;
        player.alpha = Math.max(deltaFade + player.alpha, 0);
        return player.alpha < 0.00001;
    }

    #isTriggered(x) {
        return x > this.#trigger.x && x < this.#trigger.x + this.#trigger.width;
    }
}