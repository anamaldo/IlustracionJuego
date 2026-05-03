// Jugador.js
export default class Jugador {
    constructor(scene, x, y) {
        this.scene = scene;

        // Paso todo lo que tenia en el main.js aquí para que el jugador sea un objeto con su propia lógica y no un conjunto de variables sueltas en el main.js.
        this.sprite = scene.physics.add.sprite(x, y, 'player_run');
        this.sprite.setDepth(10);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.setOrigin(0.5, 0.5);
        //this.sprite.setPipeline('Light2D'); // Activamos la luz

        // animaciones (solo idle y correr)
        if (!scene.anims.exists('correr')) {
            scene.anims.create({
                key: 'correr',
                frames: scene.anims.generateFrameNumbers('player_run', {start: 0, end: 6}),
                frameRate: 24,
                repeat: -1
            });
            //creo la animación de correr, que posteriormente ira la de idle

        }
        if (!scene.anims.exists('idle')) {
            scene.anims.create({
                key: 'idle',
                frames: scene.anims.generateFrameNumbers('player_idle', {start: 0, end: 7}),
                frameRate: 8,
                repeat: -1
            });
            //ya tengo la animación cuando esta parado. Que se aplica en el bucle de update

        }

        //Los controles
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        // Lógica de movimiento
        if (this.cursors.left.isDown) {
            this.sprite.body.setVelocityX(-260);
            this.sprite.anims.play('correr', true);
            this.sprite.flipX = true;
        } 
        else if (this.cursors.right.isDown) {
            this.sprite.body.setVelocityX(400);
            this.sprite.anims.play('correr', true);
            this.sprite.flipX = false;
        } 
        else {
            this.sprite.body.setVelocityX(0);
            this.sprite.anims.play('idle', true);
        }

        // Salto
        if (this.cursors.up.isDown && this.sprite.body.touching.down) {
            this.sprite.body.setVelocityY(-550);
        }
    }
}