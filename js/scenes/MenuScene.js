
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super(`menu-scene`);
    }

    create() {
        document.querySelector(`.loading-wrapper`).style.display = `none`;
        document.querySelector(`.warning-wrapper`).style.display = `flex`;

        setTimeout(() => {
            document.querySelector(`.warning-wrapper`).style.display = `none`;
            document.querySelector(`.menu-wrapper`).style.display = `flex`;
        }, 3000);

        document.querySelector(`.menu__start`).addEventListener(`click`, () => this.scene.start(`game-scene`))
    }

}