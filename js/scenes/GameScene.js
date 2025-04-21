import Debugger from "../classes/Debugger.js";
import SpriteCrafter from "../classes/SpriteCrafter.js";
import Time from "../classes/Time.js";

import Player from "../classes/Player.js";

import Tree from "../classes/obstacles/Tree.js";
import RingObstacle from "../classes/obstacles/RingObstacle.js";
import PathObstacle from "../classes/obstacles/PathObstacle.js";
import LightObstacle from "../classes/obstacles/LightObstacle.js";
import Cutscene from "../classes/cutscenes/Cutscene.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super(`game-scene`);
        this.floorY = 1500;
        this.worldWidth = 9074;

        this.keys = undefined;
        this.player = undefined;
        this.mapPhysics = undefined;
        
        // Obstacles
        this.treeObstacle = undefined;
        this.ringObstacle = undefined;
        this.pathObstacle = undefined;
        this.lightObstacle = undefined;


        this.endCutscene = undefined;
        this.blackScreen = undefined;
    }


    create() {
        document.querySelector(`.menu-wrapper`).style.display = `none`;
        SpriteCrafter.scene = this;

        this.mapPhysics = this.cache.json.get(`map`);
        this.keys = this.input.keyboard.createCursorKeys();

        const debugPos = Debugger.playerPos;
        const playerPos = { x: 100, y: this.floorY - 130 };
        this.player = this.add.existing(new Player (this, playerPos.x + debugPos.x, playerPos.y + debugPos.y));

        this.createBackground();
        this.createCollision();
        this.createObstacles();
        this.createCutscene();
        this.createForeground();
        this.setupCamera();
        Time.update(this.time.now);
    }

    update() {
        Time.update(this.time.now);
       
        this.player.update(this.keys);
        this.treeObstacle.update(this.player);
        this.ringObstacle.update(this.player);
        this.pathObstacle.update(this.player);
        this.lightObstacle.update(this.player);
        this.endCutscene.update(this.player);

        if (this.endCutscene.isDone)
            this.fadeOut();
    }

    createBackground() {
        const yOffset = -425;
        this.add.image(this.worldWidth * 0.5, this.floorY + yOffset, 'background');
    }

    createCollision() {
        const wallLabel = 'wall';
        const floorLabel = 'floor';
        SpriteCrafter.addSprite(null, 0, this.floorY - 200, 0, this.mapPhysics.mapStartWall, wallLabel, false); // invis wall
        SpriteCrafter.addSprite(null, 600, this.floorY - 60, 0, this.mapPhysics.mapGroundFloor1, floorLabel, false); // floor before tree
        SpriteCrafter.addSprite(null, 2300, this.floorY - 50, 0, this.mapPhysics.mapGroundFloor2, floorLabel, false); // floor after tree
        
        SpriteCrafter.addSprite(null, 2925, this.floorY - 150, 0, this.mapPhysics.mapGroundWall1, wallLabel, false); // wall at holy ring
        SpriteCrafter.addSprite(null, 3200, this.floorY - 250, 0, this.mapPhysics.mapGroundFloor3, floorLabel, false); // floor after holy ring

        SpriteCrafter.addSprite(null, 3930, this.floorY - 175, 0, this.mapPhysics.mapGroundGap, wallLabel, false); // walls for the path gap
        SpriteCrafter.addSprite(null, 4760, this.floorY - 450, 0, this.mapPhysics.mapGroundFloor2, floorLabel, false); // Floor after path
        SpriteCrafter.addSprite(null, 5390, this.floorY - 250, 0, this.mapPhysics.mapGroundDrop, wallLabel, false); // Drop after path into cave
        
        SpriteCrafter.addSprite(null, 5900, this.floorY + 90, 0, this.mapPhysics.mapGroundFloor1, floorLabel, false); // Floor for cave
        SpriteCrafter.addSprite(null, 7150, this.floorY + 91, 0, this.mapPhysics.mapGroundFloor1, floorLabel, false); // Floor for cave
        
        SpriteCrafter.addSprite(null, 6910, this.floorY - 90, 0, this.mapPhysics.mapGroundCave, floorLabel, false); // Cave platforms
        SpriteCrafter.addSprite(null, 7790, this.floorY - 30, 0, this.mapPhysics.mapGroundCavePassageWalls, wallLabel, false); // Cave end wall
        SpriteCrafter.addSprite(null, 8300, this.floorY + 50, 0, this.mapPhysics.mapGroundEnd, floorLabel, false); // Floor after cave
    }

    createObstacles() {
        const treeX = 1250;
        const treeY = this.floorY - 70;
        this.treeObstacle = new Tree(this, treeX, treeY);
        
        const ringX = 2800;
        const ringY = this.floorY - 80;
        const ringHeight = 100;
        this.ringObstacle = new RingObstacle(this, ringX, ringY, ringHeight);

        const pathX = 3400;
        const pathY = this.floorY - 265;
        const pillarStartX = 3450;
        const pathWidth = 770;
        this.pathObstacle = new PathObstacle(this, pathX, pathY, pillarStartX, pathWidth, -50, 300);

        const caveX = 6690;
        const caveY = this.floorY - 430;
        const caveWidth = 2000;
        this.lightObstacle = new LightObstacle(this, caveX, caveY, caveWidth);
    }

    createForeground() {
        const yOffset = -427;
        this.add.image(this.worldWidth * 0.5 , this.floorY + yOffset, 'foreground').depth = SpriteCrafter.foregroundZ;
    }

    createCutscene() {
        const anim = {
            start: 2,
            end: 20,
            frameRate: 4
        }
        const pos = { x: 9070, y: this.floorY - 130 };
        const trigger = { x: 8600, width: 1000 }
        const id = 'end';

        this.endCutscene = new Cutscene(this, pos, trigger, id, anim, true);

        this.blackScreen = this.add.rectangle(8000, this.floorY - 500, 3000, 2000, 0x000000);
        this.blackScreen.alpha = 0;
    }
    

    setupCamera() {
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(0, 150);
        const maxCameraBoundY = this.floorY + 80;
        this.cameras.main.setBounds(10, 0, this.worldWidth, maxCameraBoundY)
        this.cameras.main.setZoom(1.2);
    }

    fadeOut() {
        const fadeOutTime = 2; // in seconds
        if (this.blackScreen.alpha < 0.00001) { // account for epsilon
            setTimeout(() => {
                document.querySelector(`.end-wrapper`).style.display = `flex`;
            }, fadeOutTime * 1000);
        }
        
        const fadeRate = 2; 
        this.blackScreen.alpha += Time.deltaTime * (fadeOutTime / fadeRate);
        this.blackScreen.depth = SpriteCrafter.foregroundZ * 2;
    }

    /*
    endCutscene(){
        if(this.player.x > 8600){
            this.end.alpha += 0.005;
            this.end.sprite.alpha = this.end.alpha;
            this.player.setVelocityY(0)
            this.player.setVelocityX(0)
            this.player.setIgnoreGravity(true);

            if (this.end.alpha >= 1) {
                setTimeout(() => {
                    this.end.endStop = true;
                }, 4500);
                this.player.setVisible(false);
                this.cameras.main.pan(this.player.x + 500, this.player.y - 150, 1000);
                if (this.end.endStop) {
                    this.end.sprite.anims.stop(null, true);
                    this.end.fadeOutAlpha += 0.01;
                    this.end.fadeOut.alpha = this.end.fadeOutAlpha;
                } else {
                    this.end.sprite.anims.play(`end`, true);
                }
            }
        }
        if (this.end.fadeOutAlpha >= 1) {
            
        }
    }
        */
}


