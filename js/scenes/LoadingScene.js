

export default class LoadingScene extends Phaser.Scene {
    #files;

    constructor() {
        super(`loading-scene`)
        this.#files = [];
    }

    init(){
        document.querySelector(`.miccheck-wrapper`).style.display = `none`;   
        document.querySelector(`.loading-wrapper`).style.display = `flex`;
        //setTimeout(() => {
        //    this.scene.start(`menu-scene`);
        //}, 4000);
    }

    preload() {
        this.#loadSvg('background');
        this.#loadSvg('foreground');
        this.#loadSvg('caveDarkness');
 
        this.#loadImg('treeObstacle');
        this.#loadImg('platform');
        this.#loadImg('ring');
        this.#loadImg('pillarObstacle');
        
        this.#loadAtlas('character');
        this.#loadAtlas('end');
        
        this.load.json(`map`, `../assets/matterJson/mapGround.json`);
    }

    update() {
        // Start menu when all files have loaded
        for (let idx = 0; idx < this.#files.length; ++idx)
        {
            const fileName = this.#files[idx];
            if (!this.textures.exists(fileName))
                return;
        }

        this.scene.start(`menu-scene`);
    }

    #loadSvg(name) {
        this.load.svg(name, `../assets/img/${name}.svg`, { scale: 1 });
        this.#files.push(name);
    }

    #loadImg(name) {
        this.load.image(name, `../assets/img/${name}.png`);
        this.#files.push(name);
    }

    #loadAtlas(name) {
        this.load.atlas(name, `../assets/img/${name}.png`, `../assets/matterJson/${name}_atlas.json`);
        this.#files.push(name);
    }
}