import Debugger from "../classes/Debugger.js";
import SpriteCrafter from "../classes/SpriteCrafter.js";
import Time from "../classes/Time.js";

import Player from "../classes/Player.js";

import Tree from "../classes/obstacles/Tree.js";
import RingObstacle from "../classes/obstacles/RingObstacle.js";
import PathObstacle from "../classes/obstacles/PathObstacle.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super(`game-scene`);
        this.floorY = 1500;
        this.worldWidth = 9074;

        this.keys = undefined;
        this.player = undefined;
        this.mapPhysics = undefined;
        
        this.images = [];
        
        this.treeObstacle = undefined;
        this.ringObstacle = undefined;
        this.pathObstacle = undefined;

        this.end = {
            alpha: 0,
            sprite: undefined,
            endStop: false,
            fadeOut: undefined,
            fadeOutAlpha: 0,
        }
    }


    create() {
        document.querySelector(`.menu-wrapper`).style.display = `none`;
        SpriteCrafter.scene = this;

        this.mapPhysics = this.cache.json.get(`map`);
        this.keys = this.input.keyboard.createCursorKeys();
        this.createBackground();
        this.createCollision();

        const treeX = 1250;
        const treeY = this.floorY - 70;
        this.treeObstacle = new Tree(this, treeX, treeY);
        
        const ringX = 2800;
        const ringY = this.floorY - 80;
        const ringHeight = 240;
        this.ringObstacle = new RingObstacle(this, ringX, ringY, ringHeight);

        const pathX = 3400;
        const pathY = this.floorY - 265;
        const pillarStartX = 3450;
        const pathWidth = 770;
        this.pathObstacle = new PathObstacle(this, pathX, pathY, pillarStartX, pathWidth, -50, 300);

        const playerX = 100 + 3000;
        const playerY = this.floorY - 130 - 400;
        this.player = this.add.existing(new Player (this, playerX, playerY));

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

        this.endCutscene();
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
        SpriteCrafter.addSprite(null, 5390, this.floorY - 250, 0, this.mapPhysics.mapGroundFloor2, wallLabel, false); // Drop after path into cave
        
        SpriteCrafter.addSprite(null, 5900, this.floorY + 90, 0, this.mapPhysics.mapGroundFloor1, floorLabel, false); // Floor for cave
        SpriteCrafter.addSprite(null, 7150, this.floorY + 91, 0, this.mapPhysics.mapGroundFloor1, floorLabel, false); // Floor for cave
        
        SpriteCrafter.addSprite(null, 6910, this.floorY - 90, 0, this.mapPhysics.mapGroundCave, floorLabel, false); // Cave platforms
        SpriteCrafter.addSprite(null, 7790, this.floorY + 30, 0, this.mapPhysics.mapGroundCavePassageWalls, wallLabel, false); // Cave end wall
        SpriteCrafter.addSprite(null, 8300, this.floorY + 50, 0, this.mapPhysics.mapGroundEnd, floorLabel, false); // Cave end wall
    }

    createForeground() {
        const yOffset = -427;
        this.add.image(this.worldWidth * 0.5 , this.floorY + yOffset, 'foreground').depth = SpriteCrafter.foregroundZ;
        
        this.anims.create({
            key: 'end',
            frames: this.anims.generateFrameNumbers(`end`, {
                start: 2,
                end: 21,
            }),
            frameRate: 4,
        });

        this.end.sprite = this.matter.add.sprite(9070, this.floorY - 130, `end`).setStatic(true).setCollisionCategory(null);
        this.end.sprite.alpha = this.end.alpha;
        this.end.fadeOut = this.add.rectangle(8000, this.floorY - 500, 3000, 2000, 0x000000);
        this.end.fadeOut.alpha = this.end.fadeOutAlpha;
    }
    

    setupCamera() {
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(0, 150);
        this.cameras.main.setBounds(10, 0, 9070, this.floorY + 80)
        this.cameras.main.setZoom(1.2);
    }

    endCutscene(){
        if(this.player.x > 8600){
            this.playerAbleToMove = false;
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
            setTimeout(() => {
                document.querySelector(`.end-wrapper`).style.display = `flex`;
            }, 2000);
        }
    }
}


