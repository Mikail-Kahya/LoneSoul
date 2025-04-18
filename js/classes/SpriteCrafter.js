import Debugger from "./Debugger.js";

export default class SpriteCrafter {
    static #scene = undefined;
    static set scene(scene) {
        this.#scene = scene;
    };

    // visuals
    static foregroundZ = 1000;
    static playerZ = 600;
    static #interactZ = 5;
    static #textZ = 1500;

    // Colllision
    static #floorLabel = 'floor';

    static get floorLabel() {
        return this.#floorLabel;
    }

    static addSprite(id, x, y, deltaZ, shape, shapeLabel, hasVisuals = true) {
        const z = this.#interactZ + deltaZ;
        const sprite = this.#scene.matter.add.sprite(x, y, id, null, { shape: shape, label: shapeLabel });
        sprite.setOrigin(0.5, 0.5);
        sprite.w = z;
        sprite.z = z;
        sprite.depth = z;

        if (!hasVisuals)
            sprite.setVisible(false);

        return sprite;
    }

    static addText(posX, posY, text, color = 'white') {
        const font = {
            fontFamily: `runes`, 
            color: color, 
            fontSize: `2rem` 
        }
        const textObject = this.#scene.add.text(posX, posY, text, font);
        textObject.setOrigin(0.5, 0.5);
        textObject.w = this.#textZ;
        textObject.z = this.#textZ;
        textObject.depth = this.#textZ;
        return textObject;
    }
}