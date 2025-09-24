<template>
    <div class="container-zoneplay">
        <div v-if="!zonePlayIsVisible">
            <form>
                <div>
                    <label for="numJugadores">Nº Jugadores:  </label>
                    <input type="number" min="2" max="5" id="numJugadores" name="numJugadores" value="2" v-model="numJugadores">
                </div>
                <div>
                    <label for="numCartas">Nº cartas por jugador:  </label>
                    <input type="number" min="3" max="5" id="numCartas" name="numCartas" value="3" v-model="numCartas">
                </div>
                <div>
                    <label for="modoJuego">Modo juego: </label>
                    <select v-model="modoJuego" @change="cargarModoJuego" id="modoJuego" name="opciones">
                        <option value="general">Acontecimientos históricos</option>
                        <option value="inventos">Inventos</option>
                        <option value="disney">Películas Disney</option>
                    </select>
                </div>
                <div class="btn-start-play" @click="empezarJuego"><span>Empezar</span></div>
            </form>
        </div>
        <div v-if="zonePlayIsVisible" class="zone-table-play">
            <table-play @quitarCartaAlJugador="quitarCartaJugador" @sigTurno="siguienteTurno"></table-play>
        </div>
        <div v-if="zonePlayIsVisible" class="zone-players-container">
            <zone-players :montonCartas="cartasParaJugadores" :numPlayers="numJugadores" :numCards="numCartas" :cartaRetiradaId="cartaPresa" :jugadaTerminada="jugadaTerminada" @asignadoTurno="asignadoTurno"></zone-players>
        </div>
    </div>
</template>


<script>
import ZonePlayers from './ZonePlayers.vue';
import TablePlay from './TablePlay.vue';
import PlayService from '@/services/playService';

export default{

    name: "PlayZone",
    data(){
        return {
            zonePlayIsVisible: false,
            registrosHistoricos: [],
            cartasParaJugadores: [],
            numJugadores: 2,
            numCartas: 3,
            modoJuego: "general",
            cartaPresa: null,
            jugadaTerminada: false
        }
    },
    components: {
        ZonePlayers,
        TablePlay
    },
    created(){
        const servicio = new PlayService();
        //servicio.getRegistroHistRandom()
        this.registrosHistoricos = servicio.getRegistrosHistoricos();
        this.cartasParaJugadores = this.registrosHistoricos;
        //console.log("cartasParaJugadores...", this.cartasParaJugadores)

    },
    methods: {
        toggleVisibilityZonePlay() {
        // Cambia el valor booleano a su opuesto
        //console.log("LLego aqui")
        this.zonePlayIsVisible = !this.zonePlayIsVisible;
        },
        cargarModoJuego(){
            this.$store.commit("cargarModoJuego", this.modoJuego)
        },
        async empezarJuego(){
            this.toggleVisibilityZonePlay();
            //console.log("NUM JUGADORES:", this.numJugadores);
            //console.log("NUM CARTAS:", this.numCartas);
            this.$store.commit("crearJugadoresPtos", this.numJugadores)
            //console.log("NUMJUGADORES DEL STORE:", this.$store.state.puntos)
        },
        quitarCartaJugador(carta){
            this.cartaPresa = carta.id;
            //console.log("Carta presa:", this.cartaPresa)
            //console.log("tipo cartaPresa:", typeof this.cartaPresa)
        },
        asignadoTurno(){
            this.jugadaTerminada = false;
            //console.log("AsignadoTurno")
        },
        siguienteTurno(){
            this.jugadaTerminada = true;
            //console.log("SigTurno")
        }
    }

}

</script>


<style scoped>

.container-zoneplay{
    display: flex;
    flex-direction: column;
    justify-content: center;
}


form {
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: 0.5rem;
    margin: 5rem;
    padding: 0.5rem;
    
}

.btn-start-play{
    border: 4px solid #10CC93;
    width: 80px;
    background-color: #00F5A6;
    border-radius: 80px;
    margin-top: 1rem;
}

.btn-start-play:hover{
    cursor: pointer;
}


</style>