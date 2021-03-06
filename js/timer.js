// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

localStorage.setItem('times', '[]');

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
    speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
};

var $times = $('#top');

// Update game objects
var update = function (modifier) {
    if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
    }

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
            && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        reset();
    }

    if ( ( Date.now() - startTime ) > 10000 ) {
      console.log('test');
      hero.x = 1000;
      hero.y = 1000;
      monster.x = 1000;
      monster.y = 1000;
      clearInterval(intId);
      start.style.display = 'block';
      var name = prompt("Times up! What's your name?");
      times = JSON.parse(localStorage.getItem('times')) || [];
      times.push({name: name, score: monstersCaught});
      times.sort(function(a,b){return b.score - a.score});
      $times.html('');
      for( var i = 0, len = times.length; i < len; i++ ) {
        $times.append('<li>' + times[i].name + ': ' + times[i].score + '</li>');
      }
      localStorage.setItem('times', JSON.stringify(times));
    }
};

// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "22px 'Ubuntu Mono'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("GOBLINS CAUGHT: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};

var start = document.getElementById('start');
var then;
var intId;
var startTime;
start.addEventListener( 'click', function ( e ) {
    e.preventDefault();
    // Let's play this game!
    startTime = Date.now();
    monstersCaught = 0;
    reset();
    then = Date.now();
    intId = setInterval(main, 33.33); // Execute as fast as possible
    start.style.display = 'none';
}, false);
