'use strict'

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 
    'game-container', {
        preload: preload, 
        create: create,
        update: update, 
        render: render
    }
)

var player
var background
var cursors
var fireButton
var bullets
var nave01;
var nave02;
var temponave01
var temponaves = 5
var explosions;
var shields;
var scoreText;
var vidaText;
var scorePlayer = 0

function preload() {
    game.load.image('player', 'assets/player.png')
    game.load.image('background', 'assets/space_background.jpg')
    game.load.image('tiro', 'assets/bullet.png')
    game.load.image('inimigo1','assets/nave.png')
    game.load.image('inimigo2','assets/nave_2.png')
    game.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
    
}

function create() {
    game.renderer.roundPixels = true
    game.renderer.clearBeforeRender = false
    game.add.tileSprite(0, 0, game.width, game.height, 'background');
    
    player = game.add.sprite((800-14)/2 , (600-12)/2, 'player');
    player.anchor.set(0.5);
    player.health = 100;
    game.physics.enable(player, Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();
    player.body.drag.set(500);
    player.body.maxVelocity.set(200);
    
    //balas 
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(1, 'tiro');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.angle = 0;

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //inimigos 
    nave01 = game.add.group();
    nave01.enableBody = true;
    nave01.physicsBodyType = Phaser.Physics.ARCADE;
    nave01.createMultiple(2, 'inimigo1');
    nave01.setAll('anchor.x', 0.5);
    nave01.setAll('anchor.y', 0.5);
    nave01.setAll('scale.x', 0.5);
    nave01.setAll('scale.y', 0.5);
    nave01.setAll('angle', 180);
    nave01.forEach(function(item){
        item.damageAmount = 5;
    });
    nave02 = game.add.group();
    nave02.enableBody = true;
    nave02.physicsBodyType = Phaser.Physics.ARCADE;
    nave02.createMultiple(5, 'inimigo2');
    nave02.setAll('anchor.x', 0.5);
    nave02.setAll('anchor.y', 0.5);
    nave02.setAll('scale.x', 0.5);
    nave02.setAll('scale.y', 0.5);
    nave02.setAll('angle', 180);
    nave02.forEach(function(item){
        item.damageAmount = 10;
    });


    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('explosion');
    });

    var style = { font: "25px Arial", fill: "#fff", align: "left" };
    
    vidaText = game.add.text(game.world.left+5, 30, "Vida :    " + player.health , style);
    scoreText =  game.add.text(game.world.right-200, 30, "Pontuação  " + scorePlayer, style)
   
    game.time.events.add(1000, enviarInimigos);
}
function enviarInimigoX2(){
    var nave = nave02.getFirstExists(false);
    if (nave) {
        nave.reset(game.rnd.integerInRange(0, game.width), 0);
        nave.body.velocity.x = game.rnd.integerInRange(-300, 300);
        nave.body.velocity.y = 300;
        nave.body.drag.x = 100;
        nave.update = function(){
            console.log("chamou")
            nave.angle = 180 - game.math.radToDeg(Math.atan2(nave.body.velocity.x, nave.body.velocity.y));
            if (nave.y > game.height + 200) {
                nave.kill();
                nave.y = -20;
            }
        }
    }
     game.time.events.add(game.rnd.integerInRange(temponaves, temponaves + 1000), enviarInimigoX2);
}
function enviarInimigos(){
        var nave = nave01.getFirstExists(false);
    if (nave) {
        nave.reset(game.rnd.integerInRange(0, game.width), 0);
        nave.body.velocity.x = game.rnd.integerInRange(-300, 300);
        nave.body.velocity.y = 300;
        nave.body.drag.x = 100;
        nave.update = function(){
            nave.angle = 180 - game.math.radToDeg(Math.atan2(nave.body.velocity.x, nave.body.velocity.y));
            if (nave.y > game.height + 200) {
                nave.kill();
                nave.y = -20;
            }
        }
    }
    game.time.events.add(game.rnd.integerInRange(temponaves, temponaves + 1000), enviarInimigos);
}

function update() {

    if (cursors.up.isDown){
        game.physics.arcade.accelerationFromRotation(player.rotation, 200, player.body.acceleration);
    }
    else{
       
        player.body.acceleration.set(0);
    }

    if (cursors.left.isDown){
        player.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown){
        player.body.angularVelocity = 300;
    }
    else{
        player.body.angularVelocity = 0;
    }
    if(fireButton.isDown){
        atirar()
    }
    if(scorePlayer  > 50 ){
        enviarInimigoX2();
    }
    game.physics.arcade.overlap(nave01, bullets, destruirNave, null, this);
    game.physics.arcade.overlap(nave02, bullets, destruirNave, null, this);
    game.physics.arcade.overlap(player, nave01, destruirPlayer, null, this);
    game.physics.arcade.overlap(player, nave02, destruirPlayer, null, this);

    screenWrap(player);
}
function destruirPlayer(player,nave){
    var explosao = explosions.getFirstExists(false);
    explosao.reset(player.body.x ,player.body.y);
    explosao.body.velocity.y = nave.body.velocity.y;
    explosao.alpha = 0.7;
    explosao.play('explosion', 30, false, true);
    player.damage(nave.damageAmount)
    vidaText.setText("Vida :" + player.health)
    nave.kill();
    if (player.health  === 0)
    {
        player.kill();
        nave.callAll('kill');
    }


}
function destruirNave (nave,bullet){
    var explosao = explosions.getFirstExists(false);
    explosao.reset(bullet.body.x ,bullet.body.y);
    explosao.body.velocity.y = nave.body.velocity.y;
    explosao.alpha = 0.7;
    explosao.play('explosion', 30, false, true);
    scorePlayer += nave.damageAmount;
    scoreText.setText("Pontuação :" + scorePlayer)
    nave.kill();
}
function atirar(){
    var bullet = bullets.getFirstExists(false);
    if (bullet) {
        bullet.reset(player.x , player.y)
        bullet.angle = player.angle;
        game.physics.arcade.velocityFromAngle(player.angle, 400, bullet.body.velocity);
        bullet.body.velocity.x += player.body.velocity.x;
    }
}
function screenWrap (sprite) {
    
        if (player.x < 0)
        {
            player.x = game.width;
        }
        else if (player.x > game.width)
        {
            player.x = 0;
        }
    
        if (player.y < 0)
        {
            player.y = game.height;
        }
        else if (player.y > game.height)
        {
            player.y = 0;
        }
    
    }


function render() {
}
function restart(){
    
}

