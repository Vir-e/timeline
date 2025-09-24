<template>
    <div class="zone-players">
        <div v-for="player in players" v-bind:key="player.id" class="container-player" :class="{'container-player-activo': player.id === jugadorActivo.id}">
            <div class="container-cards">
                <template>
                    <div 
                        class="cards" 
                        :class="{'card-seleccionada': card.id === selectedCard}" 
                        v-for="card in player.cards" :key="card.id" 
                        @click="seleccionarCard(card.id)"
                    >
                        <div v-if="!cartasPresas.includes(card.id)">
                            <CardPlay :datos-carta="card" :mostrar-fecha="false"/> 
                        </div>
                    </div>
                </template>
            </div>
            <div class="name-player"><span>Player {{ player.id }}</span></div>
        </div>
    </div>
</template>   

<script>
import CardPlay from './CardPlay.vue';
import PlayService from '@/services/playService';
import { mapState } from 'vuex';

export default{
    name: "ZonePlayers",
    data(){
        return {
            players: [],
            selectedCard : null,
            cartasPresas : [],
            jugadorActivo : {id: 1},
        }
    },
    components: {
        CardPlay
    },
    props:{
        montonCartas:{
            type: Array,
            required: true
        },
        numPlayers:{
            type: Number,
            required: true
        },
        numCards: {
            type: Number,
            required: true
        },
        cartaRetiradaId: {
            type: Number,
            required: true
        },
        jugadaTerminada: {
            type: Boolean,
            required: true
        }

    },
    computed:{
        ...mapState({
            cartaSelDelStore: state => state.cardSeleccionada
    })
    },
    watch: {
        cartaSelDelStore(newValue){
            if(newValue === null){
                //console.log("La cardSeleccionada del store es null")
                this.selectedCard = null
                //console.log("La selectedCard de ZonePlayers es: ", this.selectedCard)

            }
        },
        cartaRetiradaId(newValue){
            console.log("New value...", newValue)
            console.log("Jugador activo...", this.jugadorActivo)
            this.cartasPresas.push(newValue);
            
            const jugActivoPlayers = this.players.find(player => player.id === this.jugadorActivo.id)

            if(jugActivoPlayers){
                jugActivoPlayers.cards = jugActivoPlayers.cards.filter(card => card.id !== newValue);
            }
            
            console.log("jugActivoPlayers---", jugActivoPlayers)
            // Encuentra el indice del jugador actvo en players
            const index = this.players.findIndex(player => player.id === jugActivoPlayers.id);
            // 2. Si el índice es válido (es decir, el jugador fue encontrado)
            if (index !== -1) {
                // 3. Reemplaza el objeto en ese índice usando splice
                this.players.splice(index, 1, jugActivoPlayers);
            }
            console.log("-----PLAYERS-----", this.players);
            if (jugActivoPlayers.cards.length === 0){
                console.log("HA GANAD EL JUGADOR ", this.jugadorActivo.id)
                this.$store.commit("proclamarGanador", this.jugadorActivo.id)
            }
            
            //console.log("Cartas presas...", this.cartasPresas);
        },
        jugadaTerminada(newValue){
            if (newValue === true){
                for(let i = 0; i < this.players.length; i++){
                    if (this.players[i].jugadorActivo){
                        // 1. Desactiva al jugador actual
                        this.players[i].jugadorActivo = false;

                        if (i === this.players.length - 1){
                            this.players[0].jugadorActivo = true;
                            this.jugadorActivo = this.players[0];
                            //console.log("JUgador activo:", this.jugadorActivo)
                        } else {
                            this.players[i+1].jugadorActivo = true;
                            this.jugadorActivo = this.players[i+1];
                            //console.log("JUgador activo:", this.jugadorActivo)
                        }
                    break;    
                    }
                    
                }
            }
            this.$emit("asignadoTurno")
            //console.log("this.players...", this.players)
            //console.log("DESDE EL WATCH DE ZONE PLAYERS ---")
            //console.log("jug1", this.players[0].jugadorActivo)
            //console.log("jug2", this.players[1].jugadorActivo)
            this.jugadorActivo = this.players.find(player => player.jugadorActivo === true);
            //console.log("Turno del jugador: ", this.jugadorActivo.id);
            this.$store.commit('selecJugActivo', this.jugadorActivo.id);
        },

    },
    async created() {
        await this.iniciarPlayers();
    },
    methods: {
        async getCardsForPlayer(playServ) {
            const cards = [];
            //for (let i = 0; i < this.num_cards_player; i++) {
            for (let i = 0; i < this.numCards; i++) {
                const elemento = await playServ.getRegistroHistRandom();
                //console.log("Este es el elem de getCards for player...", elemento)
                cards.push({
                id: elemento.id,
                title: elemento.title,
                date: elemento.date
                });
            }
            //console.log("Estas son las cards desde getCardsFprPlayer:", cards)
            return cards;
        },
        async iniciarPlayers(){
            try {
                const modoJuego = this.$store.state.modoJuego;
                // 1. Espera a que la carga de los registros se complete
                const playServ = new PlayService();
                await playServ.cargarRegistrosHistoricos(modoJuego);

                let jugadoresPtos = []
                for (let i = 1; i <= this.numPlayers; i++){
                    const cards =  await this.getCardsForPlayer(playServ);
                    //console.log("Estas son la s cartas desde iniciarplayers...", cards)
                    this.players.push(
                        {
                            id: i,
                            cards: cards,
                            jugadorActivo: i === 1 ? true : false
                            // que salte modal con input para ingresar el nombre del jugador
                        }
                    )
                    //console.log("Este es el player desde inciar:", this.players)
                    jugadoresPtos.push(
                        {   id: i,
                            ptos: 0,
                        }
                    )
                }
                // TODO: OJO!!!! En el store solo queremos almacenar los puntos, el jugador seleccionado y sus cartas se pueden quedar en ZOnePlayers
                this.$store.commit("crearJugadoresPtos", jugadoresPtos)
                //console.log("Players del store:", this.$store.state.puntos)// TODO: Replantear tema de jugadores, puntos, jugador seleccionado....
            } catch (error) {
            console.error('Ha ocurrido un error en la carga de datos o en la selección:', error);
            }
        },
        seleccionarCard(cardId) {
            //console.log("Entra en seleccionarCard")
            //console.log("cardId:", cardId);
            //console.log("SelectedCard", this.selectedCard)
            // Si el div ya estaba seleccionado, lo deseleccionamos (lo que permite desactivar)
            if (this.selectedCard === cardId) {
                this.selectedCard = null;
            } else {
                // De lo contrario, seleccionamos el div actual
                this.selectedCard = cardId;
            }

            //console.log("***************************")
            //console.log("cardId:", cardId);
            //console.log("SelectedCard", this.selectedCard)

            this.$store.commit('seleccionarCarta', this.selectedCard);
            //console.log("Carta seleccionada del store...", this.$store.state.cardSeleccionada)

        },        
    }
}
</script>


<style scoped>

.zone-players{
    display: flex;
    gap: 30px;
    justify-content: center;
    flex-wrap: wrap;
    background-color: #FCEDDC;
    padding: 2rem;
}

.container-player{
    display: flex;
    flex-direction: column;
    gap: 4px;
    background-color: gainsboro;
    pointer-events: none;
    padding: 1rem;
    border-radius: 20px;
}

.container-player-activo{
    background-color: #10CC93;
    pointer-events: all;
}

.container-cards{
    display: flex;
    gap: 8px;
}

.cards:hover{
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Sombra gris con 50% de opacidad */
}

.cards{
border-radius: 20px;
}

.card-seleccionada{
    background-color: azure;
    border-radius: 20px;
    padding: 0.3rem;
}

div span{
    font-weight: 700px;
    font-family: monospace;
    font-size: 20px;
}


</style>