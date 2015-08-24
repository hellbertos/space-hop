/**
    *@desc This code moves enemy avatars(1) across defined rows while allowing a keyboard controled player avitar(2)
    *to move(3) across the grid (defined in engine.js) to attain points(4) once the final row is reached then
    *resets(5) the player avitar to its startng point. It detects collisions(6) between player and enemy avitars
    *and removes point and life values (7) until zero lives remain at which time game play is terminated(8). The Player
    *can increase score by collecting randomly spawned and distributed gem avitars(9,10).
    *This code describes 3 distinct classes: Enemy, Item and Player
    *Some methods for functionality described above are: 1 - enemy.update(), 2 - handleInput(), 3 - player.update(),
    *4 - player.score,  5 - player.reset(), 6 - player.collisionDetect(), 7 - player.loseLife(), 8 - player.replay(),
    *9 - item.spawn(), 10 - gemDetection().
    *@title Space Hop  - Frogger-like game for the browser and FEND Program
    *@author James Ruggieri
    *@required resources.js, engine.js, style.css, index.html, image assets,
*/

"use strict";
// set inital gameState to true (which equals actively update enemy positions)
var gameState = true;

// Create Enemy Class - thx Udacians
var Enemy = function(x, y, speedMulti) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-alien.png';
    this.x = x;
    this.y = y;
    this.speedMulti = speedMulti;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (gameState === true) {
        if (this.x >= 562) {
            this.x = -70;
        }
        this.x = this.x + (dt * this.speedMulti);
        this.y = this.y;
    } else {
        this.x = this.x;
        this.y = this.y;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Item Class for bonus gems

// Set up an array of possible positions for the gems when they are spawned
var itemPosX = [0, 100, 200, 300, 400];
var itemPosY = [60, 145];

//Create Item Class
// NOTES:
// -- this.active sets the state of the gem; true means the graphic is on-screen and
//    can be interacted with
// -- this.duration is generated at time of spawning (item.spawn) to determine how long
//    it should remain on-screen
// -- this.count is an incrementor used to count off against this.duration to create an
//    equality which will trigger removal from the area of play.
var Item = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/gem-green.png';
    this.active = false;
    this.duration = 0;
    this.count = 0;
};

// Check to see if there is a gem on screen already
// If not, spawn a new gem
Item.prototype.isSpawned = function(isActive) {
    if (isActive === false) {
        item.spawn();
    }
};

// Spawn a gem at a random spot across the grid (x) the grid only in rows 4 and 5 (y) to
// enhance difficulty and only allow it for a random period of time (this.duration).
Item.prototype.spawn = function() {
    var spawnItem = Math.floor(Math.random() * 10000);
    if (spawnItem > 9950) {
        // Set the active state of the item to true so multiple gems aren't spawned
        this.active = true;

        // Set duration of gem
        this.duration = Math.floor(Math.random() * 70) + 60;

        // Get random numbers to use as available x and y positions from array
        var xCoord = Math.floor(Math.random() * 5);
        var yCoord = Math.floor(Math.random() * 2);

        //set coordinates
        this.x = itemPosX[xCoord];
        this.y = itemPosY[yCoord];
        item.render();
    }
};

// Remove the gem from the field of play and set its active state to false
Item.prototype.deActivate = function() {
    this.x = -100;
    this.count = 0;
    this.active = false;
};

// Update the gem's this.count variable to determine when to deactivate it
Item.prototype.update = function() {
    if (gameState === true && this.active === true) {
        // Generate a random number of cycles for gem to remain on screen
        this.count += 1;
        if (this.count === this.duration) {
            item.deActivate();
        }
    }
};

// Draw the gem on-screen
Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Create Player Class
// NOTES:
// -- None. Seems pretty self-explanatory
var Player = function(x, y, points, lives) {
    this.sprite = 'images/char-space-naut.png';
    this.x = x;
    this.y = y;
    this.points = points;
    this.lives = lives;
    this.hiScore = 0;
};

// If the player character moves (i.e. a control key is pressed) test to make sure it is within
// the game boundries and, if so, move to the next tile. If not, do nothing.
// NOTE: the logic is wrapped in an if/else statement testing for gameState to whether or not the game
// engine should continue updating the x,y coordinates of the enemies or just redraw them in the same
// place (i.e. "freezing game play")
Player.prototype.update = function(xMod, yMod) {
    if (gameState === true) {
        if (xMod) {
            if ((this.x === 0 && xMod < 0) || (this.x === 400 && xMod > 0)) {
                this.x = this.x;
            } else {
                this.x = this.x + xMod;
            }
        }
        if (yMod) {
            if ((this.y === 412 && yMod > 0) || (this.y === -13 && yMod < 0)) {
                this.y = this.y;
            } else {
                this.y = this.y + yMod;
            }
        }
        // Check for a collision with enemies
        this.collisionDectect();

        // Check to see if a gem is already spawned then update regardless
        // and check for a player collision with a gem -> gemDetection()
        item.isSpawned(item.active);
        item.update();
        this.gemDetection();

        // Check player position to see if they achived the top row
        // to increase score and return avitar to beginning tile
        if (yMod && this.y === -13) {
            this.score(50);
            this.reset();
        }
    } else {
        this.render();
    }
};

// Draw player avitar on-screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Check which key is pressed and update the appropriate variable
Player.prototype.handleInput = function(keyPress) {
    var changeX = 0;
    var changeY = 0;
    switch (keyPress) {
        case "left":
            changeX = -100;
            this.update(changeX, changeY);
            break;
        case "up":
            changeY = -85;
            this.update(changeX, changeY);
            break;
        case "right":
            changeX = 100;
            this.update(changeX, changeY);
            break;
        case "down":
            changeY = 85;
            this.update(changeX, changeY);
            break;
    }
};

// Rewrite the the starting values of score and lives to
// display in the DOM then call gameOn() to reset game state
// to true which un-freezes the game
Player.prototype.resetGame = function() {
    this.points = 0;
    this.lives = 3;
    this.x = 200;
    this.y = 412;

    var scoreSpan = document.getElementById('theScore');
    scoreSpan.innerHTML = this.points;

    var livesSpan = document.getElementById('livesRemaining');
    livesSpan.innerHTML = this.lives;

    this.gameOn();
};

// Add a restart button to the dom then listen for click
// to reset game variables and fire it back up
Player.prototype.replay = function() {
    var refireButton = document.getElementById('restartContain');
    refireButton.innerHTML = '<span id="button">REPLAY</span>';

    var restartButton = document.getElementById('restartContain');
    restartButton.addEventListener('click', function() {
        player.resetGame();
    });
};

// Remove the restart button then un-freeze the game by inverting gameState
Player.prototype.gameOn = function() {
    var removeButton = document.getElementById('button');
    removeButton.parentNode.removeChild(removeButton);
    gameState = !gameState;
};

// Remove one life value and check for game end; set High Score if applicable and draw it to the DOM
Player.prototype.loseLife = function() {
    this.lives -= 1;
    var livesSpan = document.getElementById('livesRemaining');
    livesSpan.innerHTML = this.lives;
    if (this.lives === 0) {
        // Check for high score and set if necessary
        if (this.points > this.hiScore) {
            this.hiScore = this.points;
            var hiScoreSpan = document.getElementById('hiScore');
            hiScoreSpan.innerHTML = this.hiScore;
        }
        gameState = false;
        player.replay();
    }
};

// Accept the number of points to add or subract from score and draw it to the DOM
Player.prototype.score = function(points) {
    this.points += points;
    var scoreSpan = document.getElementById('theScore');
    scoreSpan.innerHTML = this.points;
};

// Check for a collision between player and enemy.
// Uses a range of -70 to +70 to account for the approximate width of the enemy
Player.prototype.collisionDectect = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if ((Math.round(allEnemies[i].x) >= this.x - 70 && Math.round(allEnemies[i].x) <= this.x + 70) && (this.y === Math.round(allEnemies[i].y) + 12)) {
            this.score(-50);
            this.loseLife();
            this.reset();
        }
    }
};

// Check for collision with gem
Player.prototype.gemDetection = function() {
    if (this.x === item.x && this.y === item.y + 12) {
        this.score(100);
        item.deActivate();
    }
};

// Redraws player at starting tile when player collides with an enemy
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 412;
};


// TODO: hook up a Game Over message or screen!
// TODO: Figure out the start screen
// TODO: Possibly add in game levels adding higher-speeds? More aliens? Possibly add different
//       tiles to the space-station deck for a new look or friendly aliens on the space station
//       deck waiting for you to join them; perhaps they would offer an extra life like a gem
//       offers more points.
// TODO: Figure out a "lag" or "stall" so when Spacenaut reaches the goal, it doesn't instantly disappear
//       back to the starting tile. Perhaps add a message like Space Station Reached!


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Generate some random speeds for enemys
function getRandomSpeed(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate some random starting points for enemys
function getRandomStart(baseNum) {
    return Math.floor((Math.random() * -baseNum) + 1);
}

var enemy1 = new Enemy(getRandomStart(600), 60, getRandomSpeed(115, 125));
var enemy2 = new Enemy(getRandomStart(100), 145, getRandomSpeed(100, 110));
var enemy3 = new Enemy(getRandomStart(400), 60, getRandomSpeed(85, 95));
var enemy4 = new Enemy(getRandomStart(400), 145, getRandomSpeed(60, 80));
var enemy5 = new Enemy(getRandomStart(200), 230, getRandomSpeed(80, 100));

// Add all enemies to one array
var allEnemies = [
    enemy1,
    enemy2,
    enemy3,
    enemy4,
    enemy5
];

// Crate a new player with starting-x, starting-y, starting score, starting lives
var player = new Player(200, 412, 0, 3);

// Create a new gem
var item = new Item(-200, 200);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});