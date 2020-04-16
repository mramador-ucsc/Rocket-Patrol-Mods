let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
};
let game = new Phaser.Game(config);
// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,   
}

//reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT;
var highScore = 0;
var gameTime = 60000;
var myMusic = new Audio("./assets/gameMusic.mp3");
/*Mods Added:

(10) Track a high score that persists across scenes and display it in the UI
(10) Add your own (copyright-free) background music to the Play scene
(10) Allow the player to control the Rocket after it's fired
(10) Create a new scrolling tile sprite for the background
(10) Implement the speed increase that happens after 30 seconds in the original game
(15) Replace the UI borders with new artwork
(15) Display the time remaining (in seconds) on the screen
(15) Implement parallax scrolling

=======
(15) Create a new title screen
>>>>>>> 8ce171b00aa3f135753d736c774408dcd34e802a
(25) Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
(25) Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship
*/
