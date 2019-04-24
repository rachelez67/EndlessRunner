function SnowStorm(game, key, scale, rotation) {
  // call to Phaser.Sprite
  Phaser.Sprite.call(this, game, game.rnd.integerInRange(10, game.world.width - 10), game.rnd.integerInRange(10, game.world.height - 10), key);

  // add properties
  this.anchor.set(0.5);
  this.scale.x = scale;
  this.scale.y = scale;
  this.rotation = rotation;

//PHYSICS
  game.physics.enable(this);
  this.body.collideWorldBounds = false;
  this.body.angularVelocity = game.rnd.integerInRange(-150, 300);
  this.body.velocity.x = 250;

  console.log('made');
}
//make dorritos
SnowStorm.prototype = Object.create(Phaser.Sprite.prototype);
SnowStorm.prototype.constructor = SnowStorm;

SnowStorm.prototype.create = function(){

}

SnowStorm.prototype.update = function() {

  //check if doritos leave screen
  if (this.x > game.world.width){
    this.x = 0;
  } else if (this.x < 0){
    this.x = game.world.width;
  } 
}
