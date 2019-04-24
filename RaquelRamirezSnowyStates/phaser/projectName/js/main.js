//define Game
var game = new Phaser.Game(600, 600, Phaser.AUTO);
var player;
var score = 0;
var scoreText;
var aisle;
var ground;
var currentTime = 0;
var baseSpawnTime = 1;
var spawnTime = 1;

// define MainMenu state & methods
var MainMenu = function(game){};
MainMenu.prototype = {
  init: function(){
    console.log('MainMenu: init');
  },

  preload: function() {
    console.log('MainMenu: preload');

      //preload all assets

      //nj.com (chip aisle)
      //iconshots.com (floor)
    game.load.image('aisle', 'assets/aisle.jpg');
    game.load.image('floor', 'assets/floor.jpg')   
    game.load.image('dorrito', 'assets/dorrito.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.audio('pop01','assets/audio/pop01.mp3');

  },
  create: function(){
    console.log('MainMenu: create');
    var style = {font: "bold 32px Arial", fill:"#fff", boundsAlignH: "center",
    boundsAlignV: "middle"};
    text1 =  game.add.text(0, 0, "StArRuN!!1", style);
    text1.setTextBounds(0, 100, 400, 0);
    text = game.add.text(0, 0, "press SPACEBAR to start", style);
    text.setTextBounds(0, 200, 400, 0);
  },
  update: function(){
    //main menu logic
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      game.state.start('Play')
    }
  }
}

var Play = function(game){};
Play.prototype = {
  init: function(){
    console.log('Play: init');
    var score = 0;
  },

  preload: function(){
    console.log('Play: preload');
  },

  create: function(){
    console.log('Play: create');
    // physics enabled
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // create background
    aisle = game.add.tileSprite(0, 0, 600, 300, 'aisle');
   


    // create ground
    ground = game.add.tileSprite(0, game.world.height - 300, 600, 300, 'floor');
 
 

 

    // player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //player physics enabled
    game.physics.arcade.enable(player);

    //player physics properties
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //player animations
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    // create score tracker
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

    //make doritos
    this.dorrito = new SnowStorm(game, 'dorrito', 4, Math.PI);
    game.add.existing(this.dorrito);
    this.dorrito.x = Math.random();
    
     
  },

  // Update game loop
  update: function(){
      //Game logic

    // scroll background and ground

      aisle.tilePosition.x += -2;
      ground.tilePosition.x += -2;


    // Player collision
      var hitPlatform = game.physics.arcade.collide(player, ground);

    // Player movement
    player.body.velocity.xy = 0;
    cursors = game.input.keyboard.createCursorKeys();

    if (cursors.left.isDown)
    {
      // Player moves up
      player.body.velocity.y = 150;
      player.animations.play('right');
    }
    else if (cursors.right.isDown)
    {
      // Player moves down
      player.body.velocity.y = -150;
      player.animations.play('right');
    }
    else
    {
        // Player stands still
        player.animations.stop();
        player.frame = 4;
    }

      // obstacle timer
    currentTime += game.time.physicsElapsed;

    if (currentTime >= spawnTime)
 
    // When player hits star remove et

    function collectStar(player, star){
      // play POP sound
      sound = game.sound.play('pop01');

      // remove star
      star.kill();

      // update scoreText
      score += 10;
      scoreText.text = 'Score: ' + score;

      // if all stars are collected, end game.
      if(starCollector == 0 ){
        game.state.start('GameOver');
      }
    }

    // When player hits diamond, remove it
    function collectDiamond(player, diamond){
      diamond.kill();
      //update scoreText
      score += 50;
      scoreText.text = 'Score: ' + score;

    }

 





  }
}

  var GameOver = function(game){};
  GameOver.prototype = {
    init: function(){
      console.log('GameOver:init');
      var score;
    },

    preload: function(){
      console.log('GameOver: preload');
    },
    create: function(){
      console.log('GameOver: create');
      var style = {font: "bold 32px Arial", fill:"#fff", boundsAlignH: "center",
      boundsAlignV: "middle"};
      text1 =  game.add.text(0, 0, "Game Over!", style);
      text1.setTextBounds(0, 100, 400, 0);
      text = game.add.text(0, 0, "press SPACEBAR to retry", style);
      text.setTextBounds(0, 200, 400, 0);
      scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#fff'});

    },
    update: function(){
      // Game Over logic
      scoreText.text = 'Final Score: ' + score;
      if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        game.state.start('Play');
        score = 0;
        starCollector = 6;
      }
    }
  }

  //add states to stateManager and start MainMenu

  game.state.add('MainMenu', MainMenu);
  game.state.add('Play', Play);
  game.state.add('GameOver', GameOver);
  game.state.start('MainMenu');
