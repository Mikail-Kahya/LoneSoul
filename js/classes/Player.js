export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(scene, CHARACTER_KEY, floorY) {
        super (scene.matter.world, 100, floorY - 120, CHARACTER_KEY);
        this.scene = scene;
        this.floorY = floorY;
        this.CHARACTER_KEY = CHARACTER_KEY;
        this.speed = 4;
    }

    setupPlayer() {
        this.body.frictionStatic = 0;
        this.body.friction = 0;

        // Dimensions of player collision
        this.body.vertices[0].x += 20;
        this.body.vertices[1].x -= 20;
        this.body.vertices[2].x -= 25;
        this.body.vertices[3].x += 20;
        
        this.body.vertices[0].y += 10;
        this.body.vertices[1].y += 10;
        this.body.vertices[2].y -= 5;
        this.body.vertices[3].y -= 5;

        this.setFixedRotation() // Disable rotation of player
        this.body.label = `player`
        this.createAnims();
    }

    playerMovement(collisions, cursors, playerAbleToMove) {
        if(collisions.onPlatforms[0] || collisions.onPlatforms[1]) {
            setVelocityX(0);
            this.play(`fly`, true);
        } else if (cursors.left.isDown && playerAbleToMove) {
            this.setVelocityX(-speed);
            this.play(`left`, true); // OR this.player.anims.play(`left`, true);
        } else if (cursors.right.isDown && playerAbleToMove) {
            this.setVelocityX(4);
            this.play(`right`, true);
        } else {
            this.setVelocityX(0);
            this.play(`idle`, true);
        }
        if (cursors.up.isDown && collisions.onGround && playerAbleToMove) {
            this.setVelocityY(-6);
            collisions.onGround = false;
        }
    }

    createAnims(){

        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames(this.CHARACTER_KEY, {
                prefix: `idle_`,
                suffix: `.png`,
                start: 1,
                end: 4,
                zeroPad: 0
            }),
            frameRate: 8,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNames(this.CHARACTER_KEY, {
                prefix: `right_`,
                suffix: `.png`,
                start: 1,
                end: 2,
                zeroPad: 0
            }),
            frameRate: 10,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNames(this.CHARACTER_KEY, {
                prefix: `left_`,
                suffix: `.png`,
                start: 1,
                end: 2,
                zeroPad: 0
            }),
            frameRate: 10,
            repeat: -1
        })

        this.scene.anims.create({
            key: 'fly',
            frames: this.scene.anims.generateFrameNames(this.CHARACTER_KEY, {
                prefix: `fly_`,
                suffix: `.png`,
                start: 1,
                end: 4,
                zeroPad: 0
            }),
            frameRate: 8,
            repeat: -1
        })
    }
}