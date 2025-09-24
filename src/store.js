// src/store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Tu estado inicial
    jugadorActivo: 1,
    cardSeleccionada: null,
    cardsMesa: [],
    puntos: [], 
    ganador: 0,
    modoJuego: ""
  },
  mutations: {
    // Tus mutaciones para cambiar el estado
    cargarModoJuego(state, modo){
      state.modoJuego = modo;
    },
    selecJugActivo(state, idJugador) {
      state.jugadorActivo = idJugador;
    },
    seleccionarCarta(state, idCard){
        state.cardSeleccionada = idCard;
    },
    deseleccionarCarta(state){
      state.cardSeleccionada = null;
    },
    agregarCartaMesa(state, carta){
      state.cardsMesa.push(carta)
    },
    crearJugadoresPtos(state, jugadores){
      state.puntos = jugadores;
    },
    agregarPto(state, jugador){
      state.puntos[jugador-1]++;
    },
    quitarPto(state, jugador){
      state.puntos[jugador-1]--;
    },
    proclamarGanador(state, jugadorId){
      state.ganador = jugadorId;
    }
  },
  actions: {
    // Tus acciones para operaciones asíncronas
  },
  getters: {
    // Tus getters para obtener datos del estado
  }
});