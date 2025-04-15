// Debugger singleton
// Allows for logging and deactivating it on release builds

export default class Debugger {
    static #log = true;
    
    static log(object) {
        if (this.#log)
            console.log(object);
    }
}