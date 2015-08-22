var gameState = true;
var Enemy = function(x,y, speedMulti) {
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
    if(gameState === true) {
        if(this.x >= 562) {
            this.x = -70;
        }
        this.x = this.x + (dt*this.speedMulti);
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


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y, points, lives) {
    this.sprite = 'images/char-space-naut.png';
    this.x = x;
    this.y = y;
    this.points = points;
    this.lives = lives;
    this.hiScore = 0;
};

Player.prototype.update = function(xMod, yMod) {
    if( gameState === true ) {
        if (xMod){
        if( (this.x === 0 && xMod < 0) || (this.x === 400 && xMod > 0) ) {
            this.x === this.x;
        } else {
            this.x = this.x + xMod;
            }
        }
        if (yMod) {
            if( (this.y === 412 && yMod > 0) || (this.y === -13 && yMod < 0) ){
                this.y === this.y;
            } else {
                this.y = this.y + yMod;
            }
        }

        // Check for a collision with enemies
        player.collisiionDectect();

        // Check player position to see if they achived the top row
        if (yMod && this.y === -13) {
            player.score();
            player.reset();
        }
    } else {
        player.render();
    }

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyPress) {
    switch (keyPress) {
        case "left":
            var changeX = -100;
            var changeY = 0;
            player.update(changeX, changeY);
            break;
        case "up":
            var changeX = 0;
            var changeY = -85;
            player.update(changeX, changeY);
            break;
        case "right":
            var changeX = 100;
            var changeY = 0;
            player.update(changeX, changeY);
            break;
        case "down":
            var changeX = 0;
            var changeY = 85;
            player.update(changeX, changeY);
            break;
    }
};

// Rewrite the the starting values of score and lives to
// display in browser then call gameOn() to reset game state
// to true which un-freezes the game
Player.prototype.resetGameVars = function() {
    this.points = 0;
    this.lives = 3;
    this.x = 200;
    this.y = 412;

    var scoreSpan = document.getElementById('theScore');
    scoreSpan.innerHTML = this.points;

    var livesSpan = document.getElementById('livesRemaining');
    livesSpan.innerHTML = this.lives;

    player.gameOn();
};

// Add a restart button to the dom then listen for click
// to reset game variables and fire it back up
Player.prototype.replay = function() {
    var refireButton = document.getElementById('restartContain');
    refireButton.innerHTML='<span id="button">REPLAY</span>';

    var restartButton = document.getElementById('restartContain');
    restartButton.addEventListener('click', function(e) {
            player.resetGameVars();
        });
};

// Remove the restart button then un-freeze the game
Player.prototype.gameOn = function() {
    var removeButton = document.getElementById('button');
    removeButton.parentNode.removeChild(removeButton);
    gameState = !gameState;
};

// Remove one life value and for game end; set High Score if applicable
Player.prototype.loseLife = function() {
    this.lives -= 1;
    var livesSpan = document.getElementById('livesRemaining');
    livesSpan.innerHTML = this.lives;
    if(player.lives === 0) {
        // Check for high score and set if necessary
        if(this.points > this.hiScore) {
            this.hiScore = this.points;
            var hiScoreSpan = document.getElementById('hiScore');
            hiScoreSpan.innerHTML = this.hiScore;
        }
        gameState = false;
        player.replay();
    }
};

Player.prototype.score = function() {
    this.points +=50;
    var scoreSpan = document.getElementById('theScore');
    scoreSpan.innerHTML = this.points;
};

// Check for a collision between player and enemy.
// Uses a range of -70 to +70 to account for the approximate width of the enemy
Player.prototype.collisiionDectect = function() {
    for(var i = 0; i < allEnemies.length; i++) {
        if ( ( Math.round( allEnemies[i].x) >= this.x -70 &&  Math.round( allEnemies[i].x) <= this.x + 70) &&  (this.y === Math.round( allEnemies[i].y) + 12 ) ) {
            player.loseLife();
            player.reset();
        }
    }
};

// TODO: hook up this Game Over Method!!!!
Player.prototype.gameOver = function() {
    ctx.font = "50px Impact";
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!!",260,300);
    ctx.strokeText("GAME OVER!!",260,300);
};

// Redraws player at starting tile when player collides with an enemy
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 412;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
/*var enemy1 = new Enemy(-1070, 60, 95);
var enemy2 = new Enemy(-770, 145, 80);
var enemy3 = new Enemy(0, 60, 60);
var enemy4 = new Enemy(-100, 145, 60);
var enemy5 = new Enemy(-300, 230, 60);*/
//var enemy6 = new Enemy(100, 230, 150);

var enemy1 = new Enemy( (Math.floor((Math.random() * -600) + 1) ),60, 120);
var enemy2 = new Enemy( (Math.floor((Math.random() * -500) + 1) ),145, 100);
var enemy3 = new Enemy( (Math.floor((Math.random() * -400) + 1) ),60, 80);
var enemy4 = new Enemy( (Math.floor((Math.random() * -300) + 1) ),145, 70);
var enemy5 = new Enemy( (Math.floor((Math.random() * -200) + 1) ),230, 90);


var allEnemies = [
        enemy1,
        enemy2,
        enemy3,
        enemy4,
        enemy5
    ];

var player = new Player(200,412, 0, 3);

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

