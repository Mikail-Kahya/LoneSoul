// import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import MiccheckScene from './scenes/MiccheckScene.js'
import GameScene from './scenes/GameScene.js';
import LoadingScene from './scenes/LoadingScene.js'
import Debugger from './classes/Debugger.js';

const config = {
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    backgroundColor: `1A1A1A`,
    physics: {
        default: 'matter',
        matter: {
            debug: Debugger.shouldDraw
        },

    },
    scene: [MiccheckScene, LoadingScene, MenuScene, GameScene],
}


export default new Phaser.Game(config);