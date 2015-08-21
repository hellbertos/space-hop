// Enemies our player must avoid
var Enemy = function(x,y, speedMulti) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
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
    if(this.x >= 562) {
        this.x = -70;
    }
    this.x = this.x + (dt*this.speedMulti);
    this.y = this.y;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {

};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
};

Player.prototype.update = function(xMod, yMod) {
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
    if (yMod && this.y === -13) {
        player.score();
        player.reset();
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

Player.prototype.score = function() {
    console.log("SCORE BIZZYNASTERS!!");
};

Player.prototype.collisiionDectect = function() {
    for(var i = 0; i < allEnemies.length; i++) {
        if ( ( Math.round( allEnemies[i].x) >= this.x -70 &&  Math.round( allEnemies[i].x) <= this.x + 70) &&  (this.y === Math.round( allEnemies[i].y) + 12 ) ) {
            console.log("BOOYEAH!!");// TESTING
            player.reset();
        }
    }
};

Player.prototype.gameOver = function() {
    ctx.font = "50px Impact";
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!!",260,300);
    ctx.strokeText("GAME OVER!!",260,300);
};

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

var enemy1 = new Enemy( (Math.floor((Math.random() * -500) + 1) ),60, 120);
var enemy2 = new Enemy( (Math.floor((Math.random() * -500) + 1) ),145, 90);
var enemy3 = new Enemy( (Math.floor((Math.random() * -500) + 1) ),60, 80);
var enemy4 = new Enemy( (Math.floor((Math.random() * -500) + 1) ),145, 70);
var enemy5 = new Enemy( (Math.floor((Math.random() * -500) + 1) ),230, 80);


var allEnemies = [
        enemy1,
        enemy2,
        enemy3,
        enemy4,
        enemy5
    ];

var player = new Player(200,412);

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
