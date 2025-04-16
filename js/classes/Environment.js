
export default class Environment {
    static #scene = undefined;
    static set scene(scene) {
        this.#scene = scene;
    };

    // visuals
    static foregroundZ = 10;
    static interactZ = 5;
    static backgroundZ = 0;
    static #textZ = 15;
    static #textFont = { fontFamily: `runes`, color: `white`, fontSize: `2rem` };

    // Colllision
    static #floorLabel = 'floor';

    static get floorLabel() {
        return this.#floorLabel;
    }

    static addText(posX, posY, text) {
        
        const textObject = this.#scene.add.text(posX, posY, text, this.#textFont);
        textObject.setOrigin(0.5, 0.5);
        textObject.w = this.#textZ;
        textObject.z = this.#textZ;
        textObject.depth = this.#textZ;
        return textObject;
    }
}