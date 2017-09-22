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
var upKey
var downKey
var leftKey
var rightKey
var speed = 300

function preload() {
    game.load.image('player', 'assets/airplane1.png')
    game.load.image('background', 'assets/sky.png')
}

function create() {
    game.renderer.roundPixels = true
    game.renderer.clearBeforeRender = false
    
    background = game.add.sprite(0, 0, 'background')
    player = game.add.sprite(800/2, 600/2, 'player')
    player.anchor.setTo(0.5, 0.5)
    // controle polar
    player.moveDirection = 0
    player.moveSpeed = 0

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP)
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
}

function update() {
    //moveInEightDirections()
    moveAndRotate()
}

function moveAndRotate() {

    if (upKey.isDown) {
        player.moveSpeed += 20
    } else {
        // friccao
        player.moveSpeed *= 0.9    
    }
    /*
    if (downKey.isDown) {
        //player.moveSpeed -= 50
    }
    */

    if (leftKey.isDown) {
        player.moveDirection -= 200
    } else
    if (rightKey.isDown) {
        player.moveDirection += 200
    }

    if (player.moveSpeed < 0) {
        player.moveSpeed = 0
    } else 
    if (player.moveSpeed > 400) {
        player.moveSpeed = 400
    }

    var speedX = player.moveSpeed * Math.cos(Math.PI/180 
            * player.moveDirection * game.time.physicsElapsed)
    var speedY = player.moveSpeed * Math.sin(Math.PI/180 
            * player.moveDirection * game.time.physicsElapsed)

    player.x += speedX * game.time.physicsElapsed
    player.y += speedY * game.time.physicsElapsed
    player.angle = player.moveDirection * game.time.physicsElapsed

    screenBounds(player)
}

function moveInEightDirections() {
    var speedX = 0
    var speedY = 0

    if (upKey.isDown) {
        speedY = -speed
    } else
    if (downKey.isDown) {
        speedY = speed
    }
    
    if (leftKey.isDown) {
        speedX = -speed
    } else
    if (rightKey.isDown) {
        speedX = speed
    }
    
    // impede que o personagem se mova mais rapido na diagonal
    // x e y = 212 quando diagonal
    if (speedX != 0 && speedY != 0) {
        speedX = speedX/speed * 212
        speedY = speedY/speed * 212
    }

    // move o personagem
    player.x += speedX * game.time.physicsElapsed
    player.y += speedY * game.time.physicsElapsed

    // rotaciona o sprite de acordo com o deslocamento e X e Y
    if (speedX != 0 || speedY != 0) {
        player.angle = Math.atan2(speedY, speedX) * 180/Math.PI
    }
    // mantem o jogador dentro da tela
    screenBounds(player)
}

function screenBounds(sprite) {
    if (sprite.x < sprite.width/2) {
        sprite.x = sprite.width/2
    } else
    if (sprite.x > game.width - sprite.width/2) {
        sprite.x = game.width - sprite.width/2
    }

    if (sprite.y < sprite.height/2) {
        sprite.y = sprite.height/2
    } else
    if (sprite.y > game.height - sprite.height/2) {
        sprite.y = game.height - sprite.height/2
    }
}

function render() {
}

