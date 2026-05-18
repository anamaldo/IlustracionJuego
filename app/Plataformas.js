export default class Plataformas {
    constructor(scene) {
        this.scene = scene;
        //Grupo para las físicas
        this.plataforms = this.scene.physics.add.staticGroup();

        //lista de niveleles (coordenadas usando pY para invertir el eje Y)
        const mapa = [
            // --- SUELO PRINCIPAL (Planta Baja) ---
            { x: 1600, ySuelo: 20, w: 3200, h: 40 }, // El patio
            { x: 40, ySuelo: 20, w: 40, h: 1200 }, // Pared izquierda
            { x: 3160, ySuelo: 20, w: 40, h: 1200 }, // Pared derecha
            { x: 1600, ySuelo: 1180, w: 3200, h: 40 }, // Techo (para que el jugador no pueda saltar fuera del mapa)
            // --- PLANTA 1 ---
            // Corredor principal (viga larga)
            { x: 350, ySuelo: 360, w: 300, h: 25, key: 'viga_300' }, 
            { x: 1300, ySuelo: 360, w: 700, h: 25, key: 'viga_700' }, 
            { x: 110, ySuelo: 210, w: 100, h: 25, key: 'viga_100'}, 
            { x: 1680, ySuelo: 210, w: 140, h: 25, key: 'viga_140' },
            { x: 1920, ySuelo: 440, w: 140, h: 25, key: 'viga_140' },
            { x: 2160, ySuelo: 360, w: 300, h: 25, key: 'viga_300' },
            { x: 2740, ySuelo: 210, w: 140, h: 25, key: 'viga_140' },
            { x: 2950, ySuelo: 360, w: 420, h: 25, key:'viga_420' },
            { x: 2470, ySuelo: 500, w: 140, h: 25, key: 'viga_140' },
            { x: 2740, ySuelo: 620, w: 140, h: 25, key: 'viga_140' },

            { x: 400, ySuelo: 60, w: 25, h: 350, key: 'viga_x350' }, 
            { x: 400, ySuelo: 600, w: 25, h: 200, key: 'viga_x350' },
            // Viga 1 de carga vertical
            { x: 800, ySuelo: 60, w: 25, h: 50, key: 'viga_x250' }, // 2
            { x: 1200, ySuelo: 200, w: 25, h: 250, key: 'viga_x250' }, // 3
            { x: 1600, ySuelo: 200, w: 25, h: 540, key: 'viga_x550'}, // 4
            { x: 2000, ySuelo: 20, w: 25, h: 550, key: 'viga_x550' }, //5 
            { x: 2400, ySuelo: 345, w: 25, h: 400, key: 'viga_x400' }, //6 
            { x: 2800, ySuelo: 200, w: 25, h: 250, key: 'viga_x250'}, //7

            // --- PLANTA 2 ---
            // Viga pequeña para saltar
            { x: 740, ySuelo: 600, w: 150, h: 20, key: 'viga_300' },
            { x: 700, ySuelo: 850, w: 150, h: 20, key: 'viga_300' },
            { x: 900, ySuelo: 490, w: 100, h: 25, key: 'viga_100' },
            // Corredor 
            { x: 250, ySuelo: 720, w: 380, h: 25, key: 'viga_700' },
            { x: 1700, ySuelo: 720, w: 1400, h: 25, key: 'viga_700' }, 
            
            // Columna de soporte 
            { x: 2800, ySuelo: 525, w: 30, h: 350, key: 'viga_x350' },
            
            

            // --- PLANTA 3 (Ático/Cubierta) ---
            // Estructura de techo 
            { x: 2000, ySuelo: 980, w: 1200, h: 25, key: 'viga_700' }, 
            { x: 2800, ySuelo: 850, w: 100, h: 25, key: 'viga_100' },
            
        ];

        //creación de colisiones. Esto me ha ayudado la IA para entender como hacerlo porque me estaba liando yo sola tras invertir coodernadas.
        mapa.forEach(p => {
            const yReal = scene.pY(p.ySuelo + p.h / 2); // Convertir a coordenada real en Phaser.
            let play;
            if (p.key && scene.textures.exists(p.key)) { //de esta forma el suelo siempre existe aunque no tenga una imagen, y si tiene una imagen se muestra.
                play = scene.add.tileSprite(p.x, yReal, p.w, p.h, p.key);

                const tex = scene.textures.get(p.key).getSourceImage(); // Obtener las dimensiones de la textura para centrar el tileSprite.
                play.tilePositionX = (tex.width / 2) - (p.w / 2);
                play.tilePositionY = (tex.height / 2) - (p.h / 2);

                if (scene.lights && scene.lights.active) {
                    play.setPipeline('Light2D');
                }
            } else {
                play = scene.add.rectangle(p.x, yReal, p.w, p.h, 0x8B4513);
                play.setAlpha(0.7);            
            }

            this.plataforms.add(play); //se añade al grupo de físicas
            play.setDepth(10);

            if (play.body) {
                play.body.setSize(p.w, p.h);
                play.body.updateFromGameObject();
            }
        });
    }

    
}