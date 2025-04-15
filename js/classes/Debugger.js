// Debugger singleton
// Allows for logging and deactivating it on release builds

export default class Debugger {
    static #log = true;
    static #draw = true;

    static get shouldDraw() {
        return this.#draw;
    }
    
    static log(object) {
        if (this.#log)
            console.log(object);
    }
}