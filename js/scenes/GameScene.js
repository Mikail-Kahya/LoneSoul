import Player from "../classes/Player.js";
import Microphone from "../classes/Mic.js";
import Time from "../classes/Time.js";
import Tree from "../classes/obstacles/Tree.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super(`game-scene`);
        this.CHARACTER_KEY = `character`;
        this.player;
        this.playerAbleToMove = true;
        this.cursors;
        this.images = [];
        this.floorY = 1500;
        this.treeObstacle = undefined;
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
        this.prevTime = 0;
    }


    create() {
        document.querySelector(`.menu-wrapper`).style.display = `none`;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.createBackground();
        this.createGround();

        this.player = this.add.existing(new Player (this, this.CHARACTER_KEY, this.floorY))
        this.player.setupPlayer();
        this.createForeground();
        this.setupCamera();
        Time.update(this.time.now);
    }

    update() {
        Time.update(this.time.now);

        this.freq = Microphone.instance.freq;
        this.micLevel = Microphone.instance.level;
        this.checkCollision();
        this.player.playerMovement(this.collisions, this.cursors, this.playerAbleToMove);
        
        this.treeFall();
        this.platformRise();
        this.handleRings();
        this.pathObstacle();
        this.caveLightup();
        this.endCutscene();
    }

    createBackground() {
        this.add.image(9074 / 2, this.floorY - 425, `background`);
    }

    createGround() {
        this.mapPhysics = this.cache.json.get(`map`);

        const treeX = 1250;
        const treeY = this.floorY - 70;
        this.treeObstacle = new Tree(this, treeX, treeY);

        this.matter.add.sprite(0, this.floorY - 200, null, null, { shape: this.mapPhysics.mapStartWall, label: `wall` }).setVisible(false);
        this.matter.add.sprite(600, this.floorY - 60, null, null, { shape: this.mapPhysics.mapGroundFloor1, label: `floor` }).setVisible(false);
        this.matter.add.sprite(2300, this.floorY - 60, null, null, { shape: this.mapPhysics.mapGroundFloor2, label: `floor` }).setVisible(false);
        this.matter.add.sprite(2925, this.floorY - 150, null, null, { shape: this.mapPhysics.mapGroundWall1, label: `wall` }).setVisible(false);
        this.matter.add.sprite(3200, this.floorY - 250, null, null, { shape: this.mapPhysics.mapGroundFloor3, label: `floor` }).setVisible(false);
        this.matter.add.sprite(2800, this.floorY - 80, `platform`, null, { shape: this.mapPhysics.mapGroundPlatform, label: `floor` }).setOrigin(0.5, 0.9);
        this.matter.add.sprite(2800, this.floorY - 101.5, null, null, { shape: this.mapPhysics.mapGroundPlatformActivation, label: `platform` }).setVisible(false);
        
        this.rings = this.matter.add.sprite(2800, this.floorY - 328, `ring`, null, { shape: this.mapPhysics.holyRing, label: `ring` }).setCollisionCategory(null);
        this.rings.alpha = 0;

        this.matter.add.sprite(3400, this.floorY - 265, `platform`, null, { shape: this.mapPhysics.mapGroundPlatform, label: `floor` }).setOrigin(0.5, 0.9);
        this.matter.add.sprite(3400, this.floorY - 286.5, null, null, { shape: this.mapPhysics.mapGroundPlatformActivation, label: `platform` }).setVisible(false);
        this.matter.add.sprite(3775, this.floorY - 175, null, null, { shape: this.mapPhysics.mapGroundGap, label: `wall` }).setVisible(false);


        for (let i = 0; i < this.pathObstacleGround.totalAmount; i++) {
            const newPath = this.matter.add.sprite(this.pathObstacleGround.x, this.floorY * 2, `pillarObstacle`,  null, { shape: this.mapPhysics.pillarObstacle, label: `floor` });
            this.pathObstacleGround.array.push(newPath);
            this.pathObstacleGround.x += 7;
        }

        this.matter.add.sprite(4760, this.floorY - 450, null, null, { shape: this.mapPhysics.mapGroundFloor2, label: `floor` }).setVisible(false);
        this.matter.add.sprite(5900, this.floorY + 90, null, null, { shape: this.mapPhysics.mapGroundFloor1, label: `floor` }).setVisible(false);
        this.matter.add.sprite(7150, this.floorY + 91, null, null, { shape: this.mapPhysics.mapGroundFloor1, label: `floor` }).setVisible(false);
        this.matter.add.sprite(5390, this.floorY - 250, null, null, { shape: this.mapPhysics.mapGroundDrop, label: `wall` }).setVisible(false);
        this.matter.add.sprite(6910, this.floorY - 90, null, null, { shape: this.mapPhysics.mapGroundCave, label: `floor` }).setVisible(false);
        this.matter.add.sprite(7790, this.floorY - 30, null, null, { shape: this.mapPhysics.mapGroundCavePassageWalls, label: `wall` }).setVisible(false);
        this.matter.add.sprite(8300, this.floorY + 50, null, null, { shape: this.mapPhysics.mapGroundEnd, label: `floor` }).setVisible(false);
    }

    createForeground() {
        this.add.image(9074 / 2, this.floorY - 427, `foreground`);
        this.tutorialText.obstacle2 = this.add.text(2650, this.floorY - 40, `Use your voice to fly`, { fontFamily: `runes`, color: `white`, fontSize: `2rem` }).setVisible(false);
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

    checkCollision() {
        this.matter.world.on(`collisionstart`, (event, bodyA, bodyB) => {
            if (bodyB.parent.label === `player`) {
                if (bodyA.parent.label === `floor` || bodyA.parent.label === `platform`) {
                    this.collisions.onGround = true;
                    this.collisions.onRing = false;
                }

                if (bodyA.parent.label === `platform`) {
                    if (bodyB.position.x > 2780 && bodyB.position.x < 2880) {
                        this.collisions.onPlatforms[0] = true;
                    }
                    if(bodyB.position.x > 3380 && bodyB.position.x < 3420){
                        this.collisions.onPlatforms[1] = true;
                    }
                }
                else {
                    this.collisions.onPlatforms[0] = false;
                    this.collisions.onPlatforms[1] = false;
                }

                if (bodyA.parent.label === `ring`) {
                    this.collisions.onRing = true;
                }
            }
        })
    }

    treeFall() {
        this.treeObstacle.update(this.player.x);
    }

    platformRise() {
        const currentY = this.player.y;
        if (this.collisions.onPlatforms[0]) {
            this.tutorialText.obstacle2.setVisible(true);
            
            if (this.freq > 40 && this.micLevel > 0.05 && this.player.y > this.floorY - 430) {
                // this.player.y = currentY - this.freq/100;
                this.player.setVelocityY(-this.freq / 200)
            } else {
                this.player.setVelocityY(0);
            }

            if (this.player.y < this.floorY - 400) {
                this.tutorialText.obstacle2.setVisible(false);
                this.collisions.onRing = true;
                this.collisions.onPlatforms[0] = false;
            }
        }
    }

    handleRings() {
        if (this.collisions.onRing) {
            this.rings.setCollisionCategory(1)
            this.rings.alpha += 0.1
        } else {
            this.rings.setCollisionCategory(null)
            this.rings.alpha -= 0.1;
        }
    }

    pathObstacle(){
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
        } else if (this.pathObstacleGround.finished && this.player.x > 3300 && this.player.x < 5000 && this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).isDown){
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


