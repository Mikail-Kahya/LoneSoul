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
        
        this.images = [];
        
        this.treeObstacle = undefined;
        this.ringObstacle = undefined;
        this.pathObstacle = undefined;

        this.mapPhysics;
        this.freq;
        this.micLevel;
        this.collisions = {
            onGround: false,
            onPlatforms: [false, false],
            onRing: false,
        };
        this.rings;
        this.tutorialText = {
            obstacle2: undefined,
            obstacle3: undefined
        };
        this.pathObstacleGround = {
            totalAmount: 770/7,
            x: 3450,
            array: [],
            finished: false,
            currentPath: 0
        };
        this.caveObstacle = {
            sprite: undefined,
            alpha: 1,
        }
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
        this.createGround();

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

        this.caveLightup();
        this.endCutscene();
    }

    createBackground() {
        const yOffset = -425;
        this.add.image(this.worldWidth * 0.5, this.floorY + yOffset, 'background');
    }

    createGround() {
        const wallLabel = 'wall';
        const floorLabel = 'floor';
        SpriteCrafter.addSprite(null, 0, this.floorY - 200, 0, this.mapPhysics.mapStartWall, wallLabel, false); // invis wall
        SpriteCrafter.addSprite(null, 600, this.floorY - 60, 0, this.mapPhysics.mapGroundFloor1, floorLabel, false); // floor before tree
        SpriteCrafter.addSprite(null, 2300, this.floorY - 50, 0, this.mapPhysics.mapGroundFloor2, floorLabel, false); // floor after tree
        SpriteCrafter.addSprite(null, 2925, this.floorY - 150, 0, this.mapPhysics.mapGroundWall1, wallLabel, false); // wall at holy ring
        SpriteCrafter.addSprite(null, 3200, this.floorY - 250, 0, this.mapPhysics.mapGroundFloor3, floorLabel, false); // floor after holy ring

        SpriteCrafter.addSprite(null, 3930, this.floorY - 175, 0, this.mapPhysics.mapGroundGap, wallLabel, false); // walls for the drop

        this.matter.add.sprite(4760, this.floorY - 450, null, null, { shape: this.mapPhysics.mapGroundFloor2, label: `floor` }).setVisible(false);
        this.matter.add.sprite(5900, this.floorY + 90, null, null, { shape: this.mapPhysics.mapGroundFloor1, label: `floor` }).setVisible(false);
        this.matter.add.sprite(7150, this.floorY + 91, null, null, { shape: this.mapPhysics.mapGroundFloor1, label: `floor` }).setVisible(false);
        this.matter.add.sprite(5390, this.floorY - 250, null, null, { shape: this.mapPhysics.mapGroundDrop, label: `wall` }).setVisible(false);
        this.matter.add.sprite(6910, this.floorY - 90, null, null, { shape: this.mapPhysics.mapGroundCave, label: `floor` }).setVisible(false);
        this.matter.add.sprite(7790, this.floorY - 30, null, null, { shape: this.mapPhysics.mapGroundCavePassageWalls, label: `wall` }).setVisible(false);
        this.matter.add.sprite(8300, this.floorY + 50, null, null, { shape: this.mapPhysics.mapGroundEnd, label: `floor` }).setVisible(false);
    }

    createForeground() {
        const yOffset = -427;
        this.add.image(this.worldWidth * 0.5 , this.floorY + yOffset, 'foreground').depth = SpriteCrafter.foregroundZ;

        this.tutorialText.obstacle3 = this.add.text(3100, this.floorY - 200, `Press R to reset bridge`, { fontFamily: `runes`, color: `white`, fontSize: `2rem` }).setVisible(false);

        this.caveObstacle.sprite = this.add.image(6690, this.floorY - 430, `caveDarkness`);
        
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

    /*
    pathObstacle(){
        return;
        if(this.collisions.onPlatforms[1] && !this.pathObstacleGround.finished){ 
            this.cameras.main.pan(this.player.x + 450, this.player.y - 150, 1000); 
            if (this.freq > 50 && this.micLevel > 0.05 && this.pathObstacleGround.currentPath < this.pathObstacleGround.totalAmount) {
                this.pathObstacleGround.array[this.pathObstacleGround.currentPath].y = this.floorY + 300 - (this.freq * 1.5);
                this.pathObstacleGround.currentPath ++;
            }               
            if (this.pathObstacleGround.currentPath >= this.pathObstacleGround.totalAmount) {
                setTimeout(() => {
                    this.tutorialText.obstacle3.setVisible(true);
                }, 4000);
                this.pathObstacleGround.finished = true; 
            }
        } else if (this.pathObstacleGround.finished && this.player.x > 3300 && this.player.x < 5000 && this.keys.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).isDown){
            this.pathObstacleGround.array.forEach(element => {
                element.y = this.floorY * 2;
            });
            this.pathObstacleGround.currentPath = 0;
            this.pathObstacleGround.x = 3450;
            this.pathObstacleGround.finished = false;
        }

        if(this.player.x > 3300 && this.player.x < 5100 && this.player.y > this.floorY + 200){
            this.player.setPosition(3400, 400);
        }
        if (this.pathObstacleGround.finished) {
            this.collisions.onGround = true;
            this.collisions.onPlatforms[1] = false;
        }
    }

    */

    caveLightup(){
        if(this.freq > 50 && this.micLevel > 0.1 && this.player.x > 5700){
            this.caveObstacle.alpha -= this.freq / 10000;;
        }
        if(this.caveObstacle.alpha < 1 && this.freq < 50){
            this.caveObstacle.alpha += 0.01;
        }
        this.caveObstacle.sprite.alpha = this.caveObstacle.alpha;
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


