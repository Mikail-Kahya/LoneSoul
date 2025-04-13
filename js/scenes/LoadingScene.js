

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super(`loading-scene`)
    }

    init(){
        document.querySelector(`.miccheck-wrapper`).style.display = `none`;   
        document.querySelector(`.loading-wrapper`).style.display = `flex`;
    }

    preload() {
        this.load.svg('background', '../assets/img/background.svg', { scale: 1 });

        this.load.json(`map`, `../assets/matterJson/mapGround.json`);

        this.load.svg('foreground', '../assets/img/foreground.svg', { scale: 1 });

        this.load.svg('caveDarkness', '../assets/img/caveDarkness.svg', { scale: 1 });

        this.load.image(`treeObstacle`, `../assets/img/treeObstacle.png`);

        this.load.image('platform', '../assets/img/platform.png');

        this.load.image('ring', '../assets/img/holyRing.png');

        this.load.atlas(`character`, `../assets/img/character.png`, `../assets/matterJson/character_atlas.json`);
        
        this.load.atlas(`end`, `../assets/img/end.png`, `../assets/matterJson/end_atlas.json`);

        this.load.image(`pillarObstacle`, `../assets/img/pillarObstacle.png`);
        this.scene.start(`menu-scene`);
    }
}