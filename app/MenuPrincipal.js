
document.addEventListener('DOMContentLoaded', () => { //no sabía que al tenía que tener el Dom cargado para hacer lo de la narrativa, me lo ha dado Gemini
    const btnJugar = document.getElementById('btn-jugar');
    const menuInicio = document.getElementById('menuInicio');
    const narrativaContainer = document.getElementById('narrativaContainer');
    const textoElemento = document.getElementById('texto-narrativo');

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    const historia = "Madrid, 1850. La corrala de Tócame Roque ha quedado a oscuras. La gran verbena peligra... Recupera los cristales, enciende los 9 farolillos y devuelve la alegría a los habitantes.";

    //Narrativa con maquina de escribir
    if (!btnJugar || !menuInicio || !narrativaContainer || !textoElemento) {
        console.warn("Faltan elementos en el HTML:");
        console.log("Botón:", btnJugar);
        console.log("Contenedor Menú:", menuInicio);
        console.log("Contenedor Narrativa:", narrativaContainer);
        return; // Detenemos la ejecución para que no de el error de 'style'
    }

    btnJugar.addEventListener('click', (e) => {
        e.preventDefault(); // Evitamos que salte al index.html de golpe
        
        // Ocultamos todo lo que no sea narrativa
        menuInicio.style.display = 'none';
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
        
        // Mostramos narrativa
        narrativaContainer.style.display = 'flex';
        
        // Limpiamos el texto por si acaso y empezamos a escribir
        textoElemento.innerHTML = "";
        escribirTexto(historia, 0);
    });

    function escribirTexto(mensaje, indice) {
        if (indice < mensaje.length) {
            textoElemento.innerHTML += mensaje.charAt(indice);
            setTimeout(() => escribirTexto(mensaje, indice + 1), 50);
        }
    }

    window.addEventListener('keydown', (e) => {
        //para saltar la narrativa 
        if (e.code === 'Space' && narrativaContainer.style.display === 'flex') {
            window.location.href = 'Juego.html'; // Redirige al juego
        }
    });
});