import Microphone from "../Mic.js";

// Obstacles found in the world

export default class Obstacle {
    #activateX = {
        min: 0,
        max: 0
    }
    #finished = false;
    #levelThreshold = 0.05; // 0 - 1
    #pitchThreshold = 0.5; // 0 - 1


    get finished() {
        return this.#finished;
    }

    constructor(minX, maxX, levelThreshold, pitchThreshold)
    {
        this.#activateX.min = minX;
        this.#activateX.max = maxX;
        this.#levelThreshold = levelThreshold;
        this.#pitchThreshold = pitchThreshold;
    }

    update(player) {
        
    }

    isInRange(posX) {
        return this.#activateX.min < posX && posX < this.#activateX.max;
    }

    isLeveled() {
        return Microphone.instance.level > this.#levelThreshold;
    }

    isPitched() {
        return Microphone.instance.freqRatio > this.#pitchThreshold;
    }

    shouldUpdate(posX)
    {
        if (this.#finished)
            return false;

        if (!this.isInRange(posX))
            return false;

        return this.isLeveled() && this.isPitched();
    }

    finish() {
        this.#finished = true;
    }
}