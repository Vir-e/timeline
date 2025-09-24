<template>
    <div class="table-play">
        <div class="linea-cronologica">
            <div class="punto-accion first-pto-accion" @click="getCartasColindantes(0)"></div>
            <div v-for="(carta, index) in cardsMesa" 
                :key="carta.id" 
                class="bloque-nueva-carta-mesa">
                <div class="first-card">
                    <card-play :datos-carta="carta" />
                </div>                
                <div class="punto-accion" @click="getCartasColindantes(index+1)"></div>
            </div>
        </div>
    </div>
</template>   

<script>
import CardPlay from './CardPlay.vue';
import PlayService from '@/services/playService';

export default{
    name: "TablePlay",
    data(){
        return {
            regHistoricos: [],
            cardsMesa: [],
            cartasColindantesJugadaActual: null,
            cartaAcertada: true,
            
        }
    },
    components: {
        CardPlay
    },
    async created() {
        try {
            const modoJuego = this.$store.state.modoJuego;
            // 1. Espera a que la carga de los registros se complete
            const playServ = new PlayService();
            this.regHistoricos = await playServ.cargarRegistrosHistoricos(modoJuego);
            // 2. Solo después de que se haya cargado, llama al método que opera con la lista
            this.elementoSeleccionado = await playServ.getRegistroHistRandom();
            this.cardsMesa.push(this.elementoSeleccionado);

            //console.log('Elemento obtenido:', this.elementoSeleccionado);
            //console.log("primeraCarta recibida desde el padre:", this.primeraCarta);

            //console.log("Cartas en la mesa:", this.cardsMesa);

        // se añade la carta al array de cartas en mesa del store
        this.$store.commit('agregarCartaMesa', this.elementoSeleccionado);
        //console.log("EL array de cartas mesa del store:", this.$store.state.cardsMesa);
        } catch (error) {
            console.error('Ha ocurrido un error en la carga de datos o en la selección:', error);
        }
    },
    methods: {
        async colocarCartaEnMesa(){
            const cartaSeleccionadaJugador = this.$store.state.cardSeleccionada;
            //console.log("cartaAcertada del store llamada desde colocarEnMesa", cartaSeleccionadaJugador)
            // Aquí iria la condición para comprobar si es correcta segun eso se
            // actualiza la sig variable
            //console.log("iz:",this.cartasColindantesJugadaActual.izq)
            if (this.cartasColindantesJugadaActual.izq === null){
                this.cartasColindantesJugadaActual.izq = {"id": -10000000000}
            }
            if (this.cartasColindantesJugadaActual.dcha === null){
                this.cartasColindantesJugadaActual.dcha = {"id": 100000}
            }
            console.log("Carta seleccionada jugador:", cartaSeleccionadaJugador)
            console.log("iz:",this.cartasColindantesJugadaActual.izq.id)
            console.log("dcha:",this.cartasColindantesJugadaActual.dcha.id)
            console.log("Valores de las cartas colindantes en colocarCartaEn Mesa", this.cartasColindantesJugadaActual)
            if (cartaSeleccionadaJugador >= this.cartasColindantesJugadaActual.izq.id && cartaSeleccionadaJugador <= this.cartasColindantesJugadaActual.dcha.id){
                this.cartaAcertada = true;


            }
            else {
                this.cartaAcertada = false;
                this.$store.commit('deseleccionarCarta');
                // AVISAR A PADRE DE JUGADA TERMINADA
                this.$emit("sigTurno");
            }
            console.log("Valor cartaacertada...", this.cartaAcertada)
            if (this.cartaAcertada === true){
                //console.log("Registros...", this.regHistoricos)
                const objCarta = this.regHistoricos.find(item => item.id === cartaSeleccionadaJugador);
                //console.log("ObjCarta:", objCarta)

                // 1. Encontrar la posición donde insertar
                const indiceInsercion = this.cardsMesa.findIndex(obj => obj.id > objCarta.id);
                //Insertar el objeto en la posición correcta o al final
                if (indiceInsercion === -1) {
                    // Si no se encontró un id mayor, se inserta al final
                    this.cardsMesa.push(objCarta);

                } else{
                    // Insertar el objeto en la posición encontrada
                    this.cardsMesa.splice(indiceInsercion, 0, objCarta); 
                }
                
                this.$emit("quitarCartaAlJugador", objCarta)
                // AVISAR AL PADRE DE JUGADA TERMINADA
                this.$emit("sigTurno");

                //console.log("This.cardsMesa despues de agregar cartas:", this.cardsMesa)
                // No será push, debe comprobar antes la posición correcta en el array
                //this.cardsMesa.push(objCarta) //splice para colocar en pos determinada
                // Plantear si el componente nueva carta con el punto de accion
                // podrian se un componente con un hook created, para que al crearse,
                //creara un id para el punto y lo devolviera al padre(este componente)
                // con esto el punto ya tendrá un id, y así podremos saber si el usuario a clickado
                // en el, este componente hijo puede mandar un evento al padre con $emit
                // para avisarle de que ha sido pulsado, y cual es su carta
                // Tambien se guarda el id del punto en cartas en el array cardsMesa
                // o en otro array aparte o en el del store??

                
            }
        },

        async getCartasColindantes(posicion){
            const cartaIzq = this.cardsMesa[posicion -1] || null;
            const cartaDcha = this.cardsMesa[posicion] || null;
            //console.log('Posición del punto:', posicion);
            //console.log('Carta a la izquierda:', cartaIzq);
            //console.log('Carta a la derecha:', cartaDcha);
            this.cartasColindantesJugadaActual = {
                "izq": cartaIzq,
                "dcha": cartaDcha
            }
            //console.log("CartasColindantesJugadaActual:", this.cartasColindantesJugadaActual)
            this.colocarCartaEnMesa();
        },

        //pedirPlayZoneElimineCarta(){
        //    this.$emit("deseleccionarCarta")
        //}

    },
    
}
</script>


<style scoped>

.table-play{
    display: flex;
    align-items: center;
    background-color: #FFB766;
    border-radius: 30px 30px 0 0;
    justify-content: center;
    padding: 1rem;
}

.linea-cronologica{
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;

}


.punto-accion {
    border: 4px solid #00F5A6;
    background-color: #00F5A6;
    width: 30px;
    height: 30px;
    border-radius: 100px;
}

.punto-accion:hover {
    border: 4px solid #10CC93;
    background-color: #10CC93;
    width: 35px;
    height: 35px;
    border-radius: 100px;
    box-shadow: 0 0 10px black;
}

.punto-accion-select {
    border: 4px solid #10CC93;
    background-color: #10CC93;
    width: 35px;
    height: 35px;
    border-radius: 100px;
    box-shadow: 0 0 10px black;
}


.bloque-nueva-carta-mesa{
    display: flex;
    align-items: center;
    gap: 10px;
}

</style>