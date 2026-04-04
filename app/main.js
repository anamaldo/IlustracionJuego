console.log("happy coding")
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container', 
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Aquí cargo assets para el juego, como imágenes, sonidos, etc. 

}

function create() {
    // Aquí creo los objetos del juego, como sprites, texto, etc.
    this.add.text(100, 100, '¡happy coding!', { font: '48px Arial', fill: '#ffffff' });
    
    
    const rect = this.add.graphics();

    rect.fillStyle(0xffff00, 1)

    rect.fillRect(200, 150, 400, 300);
    
    rect.lineStyle(5, 0xffffff, 1);
    rect.strokeRect(200, 150, 400, 300);
}