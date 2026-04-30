

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600, //quiero que la relacion de aspecto sea de 4:3, por la relacion del contenido
    parent: 'game-container1', 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true // Esto muestra los límites de colisión, lo cual es útil para ver las plataformas.
        }
    },

    backgroundColor: '#6d6d6d',//esto ya lo quitare solo quiero ver como funciona el canvas
    scene: MyScene = {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Aquí cargo assets para el juego, como imágenes, sonidos, etc...
    this.load.image('espacio', 'assets/img/FondoBien.png');
    this.load.spritesheet('player_run', 'assets/img/PersonajeAnimacionLateral.png', 
        { frameWidth: 64, 
        frameHeight: 64 

    });

    this.load.spritesheet('player_idle', 'assets/img/PersobajeIdle.png',
        { frameWidth: 64, 
        frameHeight: 64
    });

    this.load.image('cartel', 'assets/img/ItemsCartel.png');
    this.load.image('marco', 'assets/img/FondoMarco.png');

};

let player;
let plataforms;
let cursors;


function create() {
    // Aquí creo los objetos del juego, como sprites, texto, etc...
    const ALTO_FONDO = 1200; //una solución a que no se colocaba el fondo bien, pero es ineficiente. 
    //Además no tiene sentido que meta elementos sueltos, los tengo que meter en funciones para poder manipularlos después.
    /*
    const suelo = this.add.rectangle(400, 580, 800, 40, 0x00ff00);
    const piso = this.add.rectangle(400, 500, 200, 20, 0x00ff00);    
    plataforms.add(suelo);
    plataforms.add(piso);
    */
    //aqui viene un sistema de luces o ilumunadores
    this.lights.enable();
    this.lights.setAmbientColor(0x333333);
    this.focoPersonaje = this.lights.addLight(0, 0, 200).setColor(0xffffff).setIntensity(1.5); //la luz de perssonaje
    //esto es aburridisimo, voy a crear una lista para meter coordenadas y tamaños de los diferentes colisionadores (suelos o paredes).
    cursors = this.input.keyboard.createCursorKeys();
    plataforms = this.physics.add.staticGroup();
    const niveles = [
        { x: 1600, y: ALTO_FONDO - 40, w: 3200, h: 40 }, // El suelo
        { x: 660, y: ALTO_FONDO - 460, w: 1200, h: 20 }, // Plataforma 1
        { x: 500, y: ALTO_FONDO - 300, w: 150, h: 20 }, // Plataforma 2
        { x: 200, y: ALTO_FONDO - 200, w: 100, h: 20 },  // Plataforma 3
        { x: 500, y: ALTO_FONDO - 120, w: 20, h: 200 }  // Plataforma 4
    ];
    // otra ilustración para las plataformas y evitar el parralax.
    niveles.forEach(nivel => {
        const plataforma = this.add.rectangle(nivel.x, nivel.y, nivel.w, nivel.h, );// la ideal es meter una imagen y luego el colisionador invisible, por eso he quitado el color.
        
        plataforms.add(plataforma);
        
        if (plataforma.body) {
            plataforma.body.updateFromGameObject();
        }
    });
    //creo la animación de correr, que posteriormente ira la de idle
    this.anims.create({
        key: 'correr',
        frames: this.anims.generateFrameNumbers('player_run', {start: 0, end: 6}),
        frameRate: 24,
        repeat: -1
    });

    //ya tengo la animación cuando esta parado. Que se aplica en el bucle de update
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player_idle', {start: 0, end: 7}),
        frameRate: 8,
        repeat: -1
    });

    player = this.physics.add.sprite(120, ALTO_FONDO - 120, 'player_run');
    player.setDepth(10);
    //player.setPipeline('Light2D'); // Esto hace que el sprite del jugador sea afectado por las luces.
    //this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    this.physics.add.collider(player, plataforms);

    let bg = this.add.image(0, 0, 'espacio').setOrigin(0, 0);
    bg.setDepth(-20);
    bg.setPipeline('Light2D'); 
    let marco = this.add.image(0, 0, 'marco').setOrigin(0, 0);
    marco.setDepth(20);
    //situo los limites de la camara y del mundo
    this.physics.world.setBounds(0, 0, 3200, 1200);
    this.cameras.main.setBounds(0, 0, 3200, 1200);
    
    let cartel = this.add.image( 400, ALTO_FONDO - 90, 'cartel');
    cartel.setPipeline('Light2D');
    cartel.setDepth(5);
    cartel.setScale(64 / 300); 
    
    //le pongo una camara que siga al jugador, porque sino esto es pochisimo, y no se puede ni jugar.
    this.cameras.main.startFollow(player, true, 0.1, 0.1);
    player.setOrigin(0.5, 0.5); 
    //camera.startFollow(player);

    
}

function update (){
    // Aquí actualizo la lógica del juego, como el movimiento de los personajes, etc...
    if (cursors.left.isDown) {
        player.body.setVelocityX(-260);
        player.anims.play('correr', true);
        player.flipX = true;
    } 
    else if (cursors.right.isDown) {
        player.body.setVelocityX(260);
        player.anims.play('correr', true);
        player.flipX = false;
    } 
    else {
        player.body.setVelocityX(0);
    //me falta el iddle
        player.anims.play('idle', true);
    }
    //aqui pondria la animacion de salto, lo dejo para mas adelante.
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-330);
    }

    //actualizo la posicion del foco para que siga al personaje
    this.focoPersonaje.x = player.x;
    this.focoPersonaje.y = player.y;
}

//a parte de que algunos elementos se tienen que organizar y crear asi, también he tomado como referencia la metodologia que aplique el semestre pasado con Mikel en la asignatura de diseño de videojuegos. 