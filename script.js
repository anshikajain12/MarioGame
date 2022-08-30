var bg, bgImage;

var mario, mario_running;
var mario_collided;

var brickGroup, brickImage;

var coinImage, coinsGroup;
var coinScore = 0;

var mushObstacleImage, turtleObstacleImage, obstaclesGroup;

var gameState = "PLAY";

var restartImg;

var pipeImage, pipeGroup;

function preload() {
  bgImage = loadImage("Assests/bg.jpg");
  mario_running = loadAnimation(
    "Assests/mar1.png",
    "Assests/mar2.png",
    "Assests/mar3.png",
    "Assests/mar4.png",
    "Assests/mar5.png",
    "Assests/mar6.png",
    "Assests/mar7.png"
  );

  brickImage = loadImage("Assests/brick.png");

  coinImage = loadAnimation(
    "Assests/con1.png",
    "Assests/con2.png",
    "Assests/con3.png",
    "Assests/con4.png",
    "Assests/con5.png"
  );

  // Add Sounds
  coinSound = loadSound("Audio/coinSound.mp3");
  jumpSound = loadSound("Audio/jump.wav");

  mushObstacleImage = loadAnimation(
    "Assests/mush1.png",
    "Assests/mush2.png",
    "Assests/mush3.png",
    "Assests/mush4.png",
    "Assests/mush5.png",
    "Assests/mush6.png"
  );
  turtleObstacleImage = loadAnimation(
    "Assests/tur1.png",
    "Assests/tur2.png",
    "Assests/tur3.png",
    "Assests/tur4.png",
    "Assests/tur5.png"
  );

  mario_collided = loadAnimation("Assests/dead.png");

  dieSound = loadSound("Audio/dieSound.mp3");

  restartImg = loadImage("Assests/restart.png");
  pipeImage=loadImage("Assests/pipe.png");
}

function setup() {
  createCanvas(1000, 650);
  bg = createSprite(600, 300);
  bg.addImage(bgImage);
  // bg.scale = 2.9;
  // bg.scale=1.0

  mario = createSprite(200, 520, 20, 50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.2;

  ground = createSprite(200, 580, 400, 10);

  brickGroup = new Group();

  coinsGroup = new Group();

  obstaclesGroup = new Group();

  pipeGroup = new Group();

  mario.addAnimation("collided", mario_collided);

  restart = createSprite(500, 300);
  restart.addImage(restartImg);
  restart.visible = false;
}

function draw() {
  drawSprites();

  if (gameState == "PLAY") {
    // Make background Move
    bg.velocityX = -5;
    if (bg.x < 100) {
      bg.x = bg.width / 4;
    }

    // Make Mario Jump-Up
    if (keyDown("space")) {
      mario.velocityY = -10;

      // Mario Jump Sound
      jumpSound.play();
    }

    // Make Mario Come-Down
    mario.velocityY = mario.velocityY + 0.5;

    // Ground for Mario
    mario.collide(ground);
    ground.visible = false;

    generateBricks();

    // Stay on Bricks
    for (var i = 0; i < brickGroup.length; i++) {
      var temp = brickGroup.get(i);
      if (temp.isTouching(mario)) {
        mario.collide(temp);
      }
    }

    // Mario Issue
    if (mario.x < 200) mario.x = 200;
    if (mario.y < 50) mario.y = 50;

    generateCoins();

    // Collect Coins
    for (var i = 0; i < coinsGroup.length; i++) {
      var temp = coinsGroup.get(i);
      if (temp.isTouching(mario)) {
        coinScore++;
        //Coin Sound
        coinSound.play();

        temp.destroy();
        temp = null;
      }
    }

    generatePipes();

    // Stay on Bricks
    for (var i = 0; i < pipeGroup.length; i++) {
      var temp = pipeGroup.get(i);
      if (temp.isTouching(mario)) {
        mario.collide(temp);
      }
     
    }
   

    generateObstacles();
    if (obstaclesGroup.isTouching(mario)) {
      dieSound.play();
      gameState = "END";
    }
  } else if (gameState === "END") {
    bg.velocityX = 0;
    mario.velocityY = 0;
    mario.velocityX = 0;


    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    pipeGroup.setVelocityXEach(0);

    brickGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    pipeGroup.setLifetimeEach(-1);

    mario.changeAnimation("collided", mario_collided);
    mario.y = 570;
    mario.scale = 0.4;

    restart.visible = true;
    if (mousePressedOver(restart)) {
      restartGame();
    }
  }

  // Score Card
  textSize(20);
  fill("red");
  text("Coins Collected: " + coinScore, 500, 50);
}

function generateBricks() {
  if (frameCount % 70 === 0) {
    var brick = createSprite(1200, 120, 40, 10);
    brick.y = random(50, 450);
    brick.addImage(brickImage);
    brick.scale = 0.5;
    brick.velocityX = -5;

    brick.lifetime = 250;

    brickGroup.add(brick);
  }
}

function generateCoins() {
  if (frameCount % 80 === 0) {
    var coin = createSprite(1200, 120, 40, 10);
    coin.y = Math.round(random(80, 350));
    coin.addAnimation("coin", coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;

    coin.lifetime = 500;

    coinsGroup.add(coin);
  }
}


function generatePipes() {
  if (frameCount % 150 === 0) {
    var pipe = createSprite(1200, 530, 40, 10);    
    pipe.addImage(pipeImage);
    pipe.scale = 0.5;
    pipe.velocityX = -5;

    pipe.lifetime = 250;

    pipeGroup.add(pipe);
  }
}

function generateObstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(1200, 555, 10, 40);
    obstacle.velocityX = -5;
    obstacle.scale = 0.1;
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addAnimation("mush", mushObstacleImage);
        break;
      case 2:
        obstacle.addAnimation("turtle", turtleObstacleImage);
        break;
      default:
        break;
    }
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function restartGame() {
  gameState = "PLAY";

  obstaclesGroup.destroyEach();
  brickGroup.destroyEach();
  coinsGroup.destroyEach();

  mario.changeAnimation("running", mario_running);
  mario.scale = 0.2;

  coinScore = 0;

  restart.visible = false;
}
