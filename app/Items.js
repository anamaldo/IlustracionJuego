//carteles
//farolillos 
//mantillas
//flores

export default class Items {
    constructor(scene) {
        this.scene = scene;
        this.itemsGroup = this.scene.physics.add.group();

        const listaItems = [
            { x: 300, ySuelo: 420, key: 'Farolillo1_Off', tipo: 'Farolillo1' },
            { x: 1500, ySuelo: 500, key: 'Farolillo1_Off', tipo: 'Farolillo1' },
            { x: 2500, ySuelo: 400, key: 'Farolillo1_Off', tipo: 'Farolillo1' },
            { x: 2900, ySuelo: 600, key: 'Farolillo1_Off', tipo: 'Farolillo1' },
            { x: 200, ySuelo: 800, key: 'Farolillo1_Off', tipo: 'Farolillo1' },
            { x: 1200, ySuelo: 800, key: 'Farolillo1_Off', tipo: 'Farolillo1' },
            { x: 1700, ySuelo: 650, key: 'Farolillo1_Off', tipo: 'Farolillo1' },
            { x: 700, ySuelo: 100, key: 'Farolillo1_Off', tipo: 'Farolillo1' },
            { x: 2500, ySuelo: 1050, key: 'Farolillo1_Off', tipo: 'Farolillo1' },

        ];

        listaItems.forEach(itemData => {
            this.crearItem(itemData);
        });

        this.scene.totalFarolillos = listaItems.filter(item => item.tipo === 'Farolillo1').length; 
        this.scene.actualizarInterfaz();

    };
 
    

    crearItem(itemData) {
        const yReal = this.scene.pY(itemData.ySuelo);
        
        const nuevoItem = this.itemsGroup.create(itemData.x, yReal, itemData.key);

        nuevoItem.tipo = itemData.tipo; // Guardamos el tipo de item por si en algún mometo se hace un inventario.
        nuevoItem.encendido = false; 

        nuevoItem.setScale(32/300); 

        nuevoItem.body.setAllowGravity(false); 
        nuevoItem.body.setImmovable(true);

        nuevoItem.body.setSize(300, 300);

        nuevoItem.setDepth(5); 

    }
}