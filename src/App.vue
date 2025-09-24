<template>
  <div id="app">
    <NavBarPpal />
    <PlayZone/>
  </div>
</template>

<script>
import NavBarPpal from './components/NavBarPpal.vue';
import PlayZone from './components/PlayZone.vue';

export default {
  name: 'App',
  components: {
    NavBarPpal,
    PlayZone
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
