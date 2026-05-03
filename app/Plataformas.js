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
            { x: 350, ySuelo: 360, w: 300, h: 25 }, 
            { x: 1300, ySuelo: 360, w: 700, h: 25 }, 
            { x: 110, ySuelo: 210, w: 100, h: 25 }, // Plataforma pequeña para saltar al corredor
            { x: 1680, ySuelo: 210, w: 140, h: 25 },
            { x: 1920, ySuelo: 440, w: 140, h: 25 },
            { x: 2160, ySuelo: 360, w: 300, h: 25 },
            { x: 2740, ySuelo: 210, w: 140, h: 25 },
            { x: 2950, ySuelo: 360, w: 420, h: 25 },
            { x: 2470, ySuelo: 500, w: 140, h: 25 },
            { x: 2740, ySuelo: 620, w: 140, h: 25 },

            { x: 400, ySuelo: 60, w: 25, h: 350 },
            { x: 400, ySuelo: 600, w: 25, h: 200 },
            // Viga 1 de carga vertical
            { x: 800, ySuelo: 60, w: 25, h: 50 }, // 2
            { x: 1200, ySuelo: 200, w: 25, h: 250 }, // 3
            { x: 1600, ySuelo: 200, w: 25, h: 540 }, // 4
            { x: 2000, ySuelo: 20, w: 25, h: 550 }, //5 
            { x: 2400, ySuelo: 345, w: 25, h: 400 }, //6 
            { x: 2800, ySuelo: 200, w: 25, h: 250 }, //7

            // --- PLANTA 2 ---
            // Viga pequeña para saltar
            { x: 740, ySuelo: 600, w: 150, h: 20 },
            { x: 700, ySuelo: 850, w: 150, h: 20 },
            { x: 900, ySuelo: 490, w: 100, h: 25},
            // Corredor 
            { x: 250, ySuelo: 720, w: 380, h: 25 },
            { x: 1700, ySuelo: 720, w: 1400, h: 25 }, 
            
            // Columna de soporte 
            { x: 2800, ySuelo: 525, w: 30, h: 350 },
            
            

            // --- PLANTA 3 (Ático/Cubierta) ---
            // Estructura de techo 
            { x: 1200, ySuelo: 1000, w: 1200, h: 25 }, 
            
        ];

        //creación de colisiones. Esto me ha ayudado la IA para entender como hacerlo porque me estaba liando yo sola tras invertir coodernadas.
        mapa.forEach(p => {
            let play;

            const yReal = scene.pY(p.ySuelo + p.h / 2); // Convertir a coordenada real en Phaser.

            if (p.angle) { 
                // Si tiene ángulo, lo creamos con add.image y luego le damos físicas
                // (Los rectángulos con físicas estáticas no rotan bien por defecto)
                // Por ahora, usaremos rectángulos sin rotar para las físicas básicas,
                // luego en ilustración pondremos la imagen rota.
                play = scene.add.rectangle(p.x, scene.pY(p.ySuelo), p.w, p.h);
                play.setAngle(p.angle); // Aplicamos la rotación visual
            } else {
                play = scene.add.rectangle(p.x, yReal, p.w, p.h);
            }
            
            this.plataforms.add(play);
            if (play.body) {
                play.body.updateFromGameObject();
            }
        });
    }

    
}