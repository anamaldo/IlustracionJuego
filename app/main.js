
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container', 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },

    backgroundColor: '#6d6d6d',//esto ya lo quitare solo quiero ver como funciona el canvas
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Aquí cargo assets para el juego, como imágenes, sonidos, etc...

}

let player;
let plataforms;
let cursors;

function create() {
    // Aquí creo los objetos del juego, como sprites, texto, etc...
    this.add.text(100, 100, '¡happy coding!', { font: '48px Arial', fill: '#ffffff' });

    //Además no tiene sentido que meta elementos sueltos, los tengo que meter en funciones para poder manipularlos después.
    /*
    
    const suelo = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
    const piso = this.add.rectangle(400, 500, 200, 20, 0x00ff00);    
    plataforms.add(suelo);
    plataforms.add(piso);
    */
    //esto es aburridisimo, voy a crear una lista para meter coordenadas y tamaños de los diferentes colisionadores (suelos o paredes).
    cursors = this.input.keyboard.createCursorKeys();
    plataforms = this.physics.add.staticGroup();
    const niveles = [
        { x: 400, y: 580, w: 800, h: 40 }, // El suelo
        { x: 400, y: 500, w: 200, h: 20 }, // Plataforma 1
        { x: 600, y: 400, w: 150, h: 20 }, // Plataforma 2
        { x: 200, y: 350, w: 100, h: 20 }  // Plataforma 3
    ];
    
    niveles.forEach(nivel => {
        const plataforma = this.add.rectangle(nivel.x, nivel.y, nivel.w, nivel.h, 0x00ff00);
        
        plataforms.add(plataforma);
        
        if (plataforma.body) {
            plataforma.body.updateFromGameObject();
        }
    });


    player = this.add.rectangle(100, 450, 50, 50, 0x0000ff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    this.physics.add.collider(player, plataforms);

}

function update (){
    // Aquí actualizo la lógica del juego, como el movimiento de los personajes, colisiones, etc...
    if (cursors.left.isDown) {
        player.body.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(160);
    } else {
        player.body.setVelocityX(0);
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-330);
    }

}