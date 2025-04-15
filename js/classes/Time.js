// Time singleton
// Grab deltaTime from anywhere

export default class Time {
    static #deltaTime = 0;
    static #prevTime = 0;
    static #maxDeltaTime = 3; // Used to avoid massive skips
    
    static get deltaTime() {
        return this.#deltaTime;
    }

    static update(time) {
        this.#deltaTime = min((time - this.#prevTime) / 1000, this.#maxDeltaTime);
        this.#prevTime = time;
    }
}