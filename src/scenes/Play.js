class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('smallSpaceship', './assets/SmallSpaceship.png');
        this.load.image('starfield', './assets/backgroundSpace.png');
        this.load.image('border', './assets/RocketPatrolBorder.png');
        this.load.image('stars', './assets/stars.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
        //load particles
        this.load.image('spark0', './assets/blue.png');
        this.load.image('spark1', './assets/red.png');
    }
    create() {
        var gameAudio = new Audio('./assets/gameMusic.mp3');
        gameAudio.play();
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.stars = this.add.tileSprite(0, 0, 640, 480, 'stars').setOrigin(0, 0);

        //white rectangle borders
        //this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.border = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'border').setOrigin(0, 0);

        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width / 2, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        //add spaceship x3
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width + 0, 260, 'spaceship', 0, 10).setOrigin(0, 0);
        this.shipS01 = new SmallSpaceship(this, game.config.width + 144, 162, 'smallSpaceship', 0, 40).setOrigin(0, 0);
        this.shipS02 = new SmallSpaceship(this, game.config.width + 48, 230, 'smallSpaceship', 0, 50).setOrigin(0, 0);

        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });

        // score
        this.p1Score = 0;

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(400, 54, 'HS:' + highScore, scoreConfig);
        this.displayTime = this.add.text(220, 54, 'T:' + gameTime / 1000, scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        //Ship Speed Increase after 30 seconds
        setTimeout(this.increaseSpeed, 30000);

    }

    update() {

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //scroll starfield
        this.starfield.tilePositionX -= .5;
        this.stars.tilePositionX -= 3;

        if (!this.gameOver) {
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.shipS01.update();
            this.shipS02.update();
            this.updatetime();
            if (this.p1Score > highScore) {
                highScore = this.p1Score;
                this.scoreRight.text = 'HS:' + highScore;
            }
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        if (this.checkCollision(this.p1Rocket, this.shipS01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipS01);
        }
        if (this.checkCollision(this.p1Rocket, this.shipS02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipS02);
        }
        //Check if game is over, if it is, display 0 time left
        if (this.gameOver) {
            this.displayTime.text = 'T:0'
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        this.sound.play('sfx_explosion');

        for (var i = 0; i < 10; i++) {
            var emitter0 = this.add.particles('spark0').createEmitter({
                x: ship.x,
                y: ship.y,
                speed: { min: -400, max: 400 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.5, end: 0 },
                blendMode: 'SCREEN',
                //active: false,
                lifespan: 600,
                gravityY: 0
            });

            var emitter1 = this.add.particles('spark1').createEmitter({
                x: ship.x,
                y: ship.y,
                speed: { min: -400, max: 400 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.3, end: 0 },
                blendMode: 'SCREEN',
                //active: false,
                lifespan: 300,
                gravityY: 0
            });
            emitter0.explode();
            emitter1.explode();

        }
        ship.reset();                       // reset ship position
        ship.alpha = 1;                     // make ship visible again
    }
    increaseSpeed() {
        game.settings.spaceshipSpeed = game.settings.spaceshipSpeed * 2.5;
    }
    updatetime() {
        gameTime -= 16.6666;
        if (gameTime >= 16.666) {

            this.displayTime.text = 'T:' + gameTime / 1000;
        }
    }
}