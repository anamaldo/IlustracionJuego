import Jugador from './Jugador.js'; //Esto se lo he pedido a la IA, porque no tenía ni idea de como hacer que este scrpit sea el gestor de los demas.
import Plataformas from './Plataformas.js';
import Items from './Items.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600, //quiero que la relacion de aspecto sea de 4:3, por la relacion del contenido
    parent: 'game-container1', 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 850 },
            debug: false // Esto muestra los límites de colisión, lo cual es útil para ver las plataformas.
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
    this.load.image('espacio', './assets/img/FondoBien.png');
    this.load.image('viga_300', './assets/img/Plataformas300x25.png');
    this.load.image('viga_700', './assets/img/Plataformas700x25.png');
    this.load.image('viga_100', './assets/img/Plataformas100x25.png');
    this.load.image('viga_140', './assets/img/Plataformas140x25.png');
    this.load.image('viga_420', './assets/img/Plataformas420x25.png');
    this.load.image('viga_x350', './assets/img/Plataformas25x350.png');
    this.load.image('viga_x200', './assets/img/Plataformas25x200.png');
    this.load.image('viga_x250', './assets/img/Plataformas25x250.png');
    this.load.image('viga_x550', './assets/img/Plataformas25x550.png');
    this.load.image('viga_x400', './assets/img/Plataformas25x400.png');
    //Farolillos
    this.load.image('Farolillo1_On', './assets/img/ItemsFarolillo1.png');
    this.load.image('Farolillo1_Off', './assets/img/ItemsFarolillo1_F.png');

    this.load.spritesheet('player_run', './assets/img/PersonajeAnimacionLateral.png', 
        { frameWidth: 64, 
        frameHeight: 64 

    });

    this.load.spritesheet('player_idle', './assets/img/PersobajeIdle.png',
        { frameWidth: 64, 
        frameHeight: 64
    });

    this.load.image('cartel', './assets/img/ItemsCartel.png');
    this.load.image('marco', './assets/img/FondoMarco.png');
    

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
    
    //contador de farolillos 
    this.totalFarolillos = 0;
    this.farolillosEncendidos = 0;

    this.textoContador = this.add.text(20, 20, 'Luces: 0 / 0', {
        fontSize: '24px',
        fill: '#ffaa00',
        stroke: '#000000',
        strokeThickness: 4,
        fontWeight: 'bold'
    }).setScrollFactor(0).setDepth(100);

    //los items
    this.items = new Items(this); 
    this.teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.indicadorInteraccion = this.add.text(0, 0, 'Presiona E para interactuar', { 
        font: '16px Arial', 
        fill: '#ffffff', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }).setOrigin(0.5).setDepth(15).setVisible(false); // Indicador de interacción, inicialmente oculto

    let bg = this.add.image(0, 0, 'espacio').setOrigin(0, 0);
    bg.setDepth(-20);
    bg.setPipeline('Light2D'); 

    let marco = this.add.image(0, 0, 'marco').setOrigin(0, 0);
    marco.setDepth(20);

    this.entorno = new Plataformas(this); //esto es para que el entorno sea un objeto de la escena, y pueda acceder a sus propiedades desde cualquier parte de la escena, como por ejemplo en el update para hacer colisiones.

    playerObj = new Jugador(this, 120, pY(120)); //creo el jugador a partir de la clase Jugador, que se encarga de crear el sprite, las animaciones y los controles. 
    this.physics.add.collider(playerObj.sprite, this.entorno.plataforms); //añado la colision entre el jugador y las plataformas, esto es necesario para que salte y no caiga al infinito.

    //situo los limites de la camara y del mundo
    //le pongo una camara que siga al jugador, porque sino esto es pochisimo, y no se puede ni jugar.
    this.physics.world.setBounds(0, 0, 3200, 1200);
    this.cameras.main.setBounds(0, 0, 3200, 1200);
    this.cameras.main.startFollow(playerObj.sprite, true, 0.1, 0.1);

    this.farolilloCercano = null;
    

};

function update (){
    // Aquí actualizo la lógica del juego, como el movimiento de los personajes, etc...
    playerObj.update();

    //actualizo la posicion del foco para que siga al personaje
    this.focoPersonaje.x = playerObj.sprite.x;
    this.focoPersonaje.y = playerObj.sprite.y;

    let detectado = false; 

    this.physics.overlap(playerObj.sprite, this.items.itemsGroup, (player, item) => {
        if (item.tipo === 'Farolillo1' && !item.encendido) {
            detectado = true;
            this.farolilloCercano = item;
            
            // Posicionamos el indicador sobre el farolillo
            this.indicadorInteraccion.setPosition(item.x, item.y - 40);
            this.indicadorInteraccion.setVisible(true);
        }
    });

    if (!detectado) {
        this.indicadorInteraccion.setVisible(false);
        this.farolilloCercano = null;
    }

    // Si hay un farolillo cerca Y se pulsa la tecla E 
    if (this.farolilloCercano && Phaser.Input.Keyboard.JustDown(this.teclaE)) {
        activarFarolillo.call(this, playerObj.sprite, this.farolilloCercano);
    }
}

//a parte de que algunos elementos se tienen que organizar y crear asi, también he tomado como referencia la metodologia que aplique el semestre pasado con Mikel en la asignatura de diseño de videojuegos. 

function activarFarolillo(player, item) {
    if (item.tipo === 'Farolillo1' && !item.encendido) {
        item.encendido = true;
        this.farolillosEncendidos++; // Suma
        this.actualizarInterfaz();   // Actualización

        this.indicadorInteraccion.setVisible(false);

        item.setTexture('Farolillo1_On'); // Cambia la textura para mostrar el farolillo encendido
        item.setPipeline('Light2D');
        
        const luzFarolillo = this.lights.addLight(item.x, item.y, 160).setColor(0xffaa00).setIntensity(1.5);
        
        this.tweens.add({
            targets: luzFarolillo,
            intensity: { from: 1.5, to: 1.8 },
            radius: { from: 155, to: 165 },
            duration: 200,
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                luzFarolillo.x = item.x + (Math.random() * 2 - 1); // Agrega un pequeño movimiento aleatorio para simular el parpadeo
                
            }
        });

        //Comprobación
        if (this.farolillosEncendidos === this.totalFarolillos) {
            iluminacionTotal.call(this);
        }

        this.cameras.main.flash(200, 255, 200, 0, 0.1);
    };
};

function iluminacionTotal() {
    //recuperación de la luz ambiental original
    this.tweens.addCounter({
        from: 51,
        to: 255,
        duration: 6000,
        onUpdate: (tween) => {
            const v = Math.floor(tween.getValue());
            this.lights.setAmbientColor(Phaser.Display.Color.GetColor(v, v, v));
        }
    });

    this.add.text(400, 300, '¡Que empiece la Gran Verbena!', {
        fontSize: '32px',
        fill: '#ffaa00',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

};

Phaser.Scene.prototype.actualizarInterfaz = function() {
    this.textoContador.setText(`Luces: ${this.farolillosEncendidos} / ${this.totalFarolillos}`);
};