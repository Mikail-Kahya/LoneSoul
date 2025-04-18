import Debugger from "./Debugger.js";

export default class Player extends Phaser.Physics.Matter.Sprite {
    #speed = 2;
    #jumpPower = 4;
    #width = 50;
    #height = 50;
    #isGrounded = false;
    #allowInput = true;
    #moveDir = 0;

    constructor(scene, posX, posY) {
        super (scene.matter.world, posX, posY);
        
        // Logic
        this.body.label = `player`
        this.body.gravityScale.y = 0.25;
        this.#setupCollision();
        this.#setupEvents(scene);

        // Visuals
        this.#createAnims(scene);
        this.setState('idle');

        Debugger.log(this);
    }

    #setupCollision() {
        this.setFixedRotation() // Disable rotation of player
        this.body.frictionStatic = 0;
        this.body.friction = 0;

        // Dimensions of player collision
        const halfWidth = this.#width * 0.5;
        const halfHeight = this.#height * 0.5;

        // Bottom right
        this.body.vertices[0].x += halfWidth;
        this.body.vertices[0].y += halfHeight;

        // Bottom left
        this.body.vertices[1].x -= halfWidth;
        this.body.vertices[1].y += halfHeight;

        // Top left
        this.body.vertices[2].x -= halfWidth;
        this.body.vertices[2].y -= halfHeight;

        // Top right
        this.body.vertices[3].x += halfWidth;
        this.body.vertices[3].y -= halfHeight;
    }

    #setupEvents(scene) {
        scene.matter.world.on(`collisionend`, (event, bodyA, bodyB) => {
            if (bodyA.body === this.body || bodyB.body === this.body)
            {
                const floorLabel = 'floor';
                if (bodyA.parent.label === floorLabel || bodyB.parent.label === floorLabel)
                    this.#isGrounded = false;
            }
        });

        scene.matter.world.on(`collisionstart`, (event, bodyA, bodyB) => {
            if (bodyA === this.body || bodyB === this.body)
            {
                const floorLabel = 'floor';
                if (bodyA.parent.label === floorLabel || bodyB.parent.label === floorLabel)
                    this.#isGrounded = true;
            }
        });
    }

    #createAnims(scene) {
        const key = 'character';
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNames(key, {
                prefix: `idle_`,
                suffix: `.png`,
                start: 1,
                end: 4,
                zeroPad: 0
            }),
            frameRate: 8,
            repeat: -1
        })

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNames(key, {
                prefix: `right_`,
                suffix: `.png`,
                start: 1,
                end: 2,
                zeroPad: 0
            }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNames(key, {
                prefix: `left_`,
                suffix: `.png`,
                start: 1,
                end: 2,
                zeroPad: 0
            }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: 'fly',
            frames: scene.anims.generateFrameNames(key, {
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

    // ====== PLAYER LOGIC =========

    setState(state) {
        switch(state) {
            case 'idle':
                this.setVelocityX(0);
                this.#allowInput = true;
                this.play('idle', true);
                break;
            case 'left':
                this.#allowInput = true;
                this.play('left', true);
                break;
            case 'right':
                this.#allowInput = true;
                this.play('right', true);
                break;
            case 'fly':
                this.#allowInput = false;
                this.play('fly', true);
                break;
        }
    }

    update(input)
    {
        if (this.#allowInput)
            this.#movement(input);
        else
            this.setVelocityX(0);
        
        this.setOrigin(0.5, 1);
    }

    #movement(input)
    {
        if (input.up.isDown && this.#isGrounded) {
            this.setVelocityY(-this.#jumpPower);
            this.#isGrounded = false;
        }

        if (input.left.isDown) {
            if (this.#moveDir !== -1)
                this.setState('left');
            this.#moveDir = -1;
            this.setVelocityX(-this.#speed);
        } else if (input.right.isDown) {
            if (this.#moveDir !== 1)
                this.setState('right');
            this.#moveDir = 1;
            this.setVelocityX(this.#speed);
        } else {
            if (this.#moveDir !== 0)
                this.setState('idle');
            this.#moveDir = 0;
            this.setVelocityX(0);
        }
    }
}