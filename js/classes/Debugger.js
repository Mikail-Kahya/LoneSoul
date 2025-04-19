// Debugger singleton
// Allows for logging and deactivating it on release builds

export default class Debugger {
    static #log = true;
    static #draw = true;
    static #playerPos = true;

    static get shouldDraw() {
        return this.#draw;
    }

    static get playerPos() {
        return this.#playerPos ? {x: 8000, y: 0 } : {x: 0, y: 0};
    }
    
    static log(object) {
        if (this.#log)
            console.log(object);
    }
}