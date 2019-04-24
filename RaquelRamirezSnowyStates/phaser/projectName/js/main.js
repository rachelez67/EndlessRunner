//define Game
var game = new Phaser.Game(400, 600, Phaser.AUTO);
var platforms;
var player;
var score = 0;
var scoreText;
var villan;
var villan2;
var starCollector = 6;
var sound;

// define MainMenu state & methods
var MainMenu = function(game){};
MainMenu.prototype = {
  init: function(){
    console.log('MainMenu: init');
  },

  preload: function() {
    console.log('MainMenu: preload');

    //preload all assets
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.image('dorrito', 'assets/dorrito.png');
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.audio('pop01','assets/audio/pop01.mp3');

  },
  create: function(){
    console.log('MainMenu: create');
    var style = {font: "bold 32px Arial", fill:"#fff", boundsAlignH: "center",
    boundsAlignV: "middle"};
    text1 =  game.add.text(0, 0, "StArRuN!!1!", style);
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
    game.add.sprite(0, 0, 'sky');

    // platforms
    platforms = game.add.group();
    platforms.enableBody = true;

    // create ground
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2,2);
    ground.body.immovable = true;

    // create legdes
    var ledge = platforms.create(350, 100, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(250, 250, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-350, 150, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-260, 380, 'ground');
    ledge.body.immovable = true;

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

    stars = game.add.group();
    stars.enableBody = true;

    //make starbois
    for (var i = 0; i < 12; i++)
    {
      var star = stars.create(i * 70, 0, 'star');
      star.body.gravity.y = 6;
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    // create diamond and spawn at random points
    diamonds = game.add.group();
    diamonds.enableBody = true;
    var diamond = diamonds.create(game.world.randomX, game.world.randomY, 'diamond');

    // Create baddie 1
    villan = game.add.sprite(32, game.world.height - 250, 'baddie');

    // Baddie 1 physics
    game.physics.arcade.enable(villan);
    villan.animations.add('left', [0,1], 10, true);

    // Create baddie 2
    villan2 = game.add.sprite(350, game.world.width - 180, 'baddie');
    // Baddie 2 pysics
    game.physics.arcade.enable(villan2);
    villan2.animations.add('right', [2,3], 10, true);


    // create score tracker
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

    //make 100 doritos
     for (var i = 0; i < 100; i++){
         this.dorrito = new SnowStorm(game,'dorrito', 2, Math.PI);
         game.add.existing(this.dorrito);
         this.dorrito.x = Math.random();
         this.dorrito.y = Math.random();
     }
  },

  // Update game loop
  update: function(){
    //Game logic
    // Player collision
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    // Player movement
    player.body.velocity.x = 0;
    cursors = game.input.keyboard.createCursorKeys();

    if (cursors.left.isDown)
    {
      // Player moves left
      player.body.velocity.x = -150;
      player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
      // Player moves right
      player.body.velocity.x = 150;
      player.animations.play('right');
    }
    else
    {
        // Player stands still
        player.animations.stop();
        player.frame = 4;
    }
    // Let player jump if touching the ground
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
      player.body.velocity.y = -350;
    }

    // When player hits star remove et

    function collectStar(player, star){
      // play POP sound
      sound = game.sound.play('pop01');

      // remove star
      star.kill();

      //reduce star count
      starCollector--;

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

    // When player hits Baddie, remove it
    function killBaddie(player, villan){
      villan.kill();

      score -= 25;
      scoreText.text = 'Score: ' + score;
      // update game state
      game.state.start('GameOver');
    }

    // Check star collision
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //Check diamond collision
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);

    // Baddie 1&2 animations and physics
    villan.animations.play('left');
    villan2.animations.play('right');
    game.physics.arcade.collide(villan, platforms);
    game.physics.arcade.collide(villan2, platforms);

    // Check baddie collision
    game.physics.arcade.overlap(player, villan, killBaddie, null, this);
    game.physics.arcade.overlap(player, villan2, killBaddie, null, this);


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
