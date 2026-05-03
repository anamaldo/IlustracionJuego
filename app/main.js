import Jugador from './Jugador.js'; //Esto se lo he pedido a la IA, porque no tenía ni idea de como hacer que este scrpit sea el gestor de los demas.
import Plataformas from './Plataformas.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600, //quiero que la relacion de aspecto sea de 4:3, por la relacion del contenido
    parent: 'game-container1', 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 850 },
            debug: true // Esto muestra los límites de colisión, lo cual es útil para ver las plataformas.
        }
    },

    backgroundColor: '#525252',//esto ya lo quitare solo quiero ver como funciona el canvas
    scene: {
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

let playerObj;
let entorno; //para la instacia de las plataformas
const pY = (y) => 1200 - y; //para invertir el eje Y, porque en phaser el 0,0 es arriba a la izquierda, y yo quiero que sea abajo a la izquierda.
Phaser.Scene.prototype.pY = pY; //añado la función pY al prototipo de la escena para poder usarla en cualquier parte de la escena .

function create() {
    // Aquí creo los objetos del juego, como sprites, texto, etc...
    //aqui viene un sistema de luces o ilumunadores
    this.lights.enable().setAmbientColor(0x333333);
    this.focoPersonaje = this.lights.addLight(0, 0, 200).setColor(0xffffff).setIntensity(1.5); //la luz de perssonaje
    
    let bg = this.add.image(0, 0, 'espacio').setOrigin(0, 0);
    bg.setDepth(-20);
    bg.setPipeline('Light2D'); 

    let marco = this.add.image(0, 0, 'marco').setOrigin(0, 0);
    marco.setDepth(20);

    entorno = new Plataformas(this); //creo el entorno a partir de la clase Plataformas, a partir de una lista de coordenadas y dimensiones.
    this.entorno = new Plataformas(this); //esto es para que el entorno sea un objeto de la escena, y pueda acceder a sus propiedades desde cualquier parte de la escena, como por ejemplo en el update para hacer colisiones.

    playerObj = new Jugador(this, 120, pY(120)); //creo el jugador a partir de la clase Jugador, que se encarga de crear el sprite, las animaciones y los controles. 
    this.physics.add.collider(playerObj.sprite, this.entorno.plataforms); //añado la colision entre el jugador y las plataformas, esto es necesario para que salte y no caiga al infinito.

    let cartel = this.add.image( 400, pY(90), 'cartel').setPipeline('Light2D').setDepth(5).setScale(64 / 300);
    let cartel2 = this.add.image( 90, pY(630), 'cartel').setPipeline('Light2D').setDepth(5).setScale(64 / 300);
    
    //situo los limites de la camara y del mundo
    //le pongo una camara que siga al jugador, porque sino esto es pochisimo, y no se puede ni jugar.
    this.physics.world.setBounds(0, 0, 3200, 1200);
    this.cameras.main.setBounds(0, 0, 3200, 1200);
    this.cameras.main.startFollow(playerObj.sprite, true, 0.1, 0.1);

    
}

function update (){
    // Aquí actualizo la lógica del juego, como el movimiento de los personajes, etc...
    playerObj.update();

    //actualizo la posicion del foco para que siga al personaje
    this.focoPersonaje.x = playerObj.sprite.x;
    this.focoPersonaje.y = playerObj.sprite.y;
}

//a parte de que algunos elementos se tienen que organizar y crear asi, también he tomado como referencia la metodologia que aplique el semestre pasado con Mikel en la asignatura de diseño de videojuegos. 