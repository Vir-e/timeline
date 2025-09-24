<template>
    <div class="container-navbar">
        <div class="item-navbar logo"><span class="logo-span">Timeline</span></div>
        <div v-if ="ganador!==0" class="item-navbar proclamacion-ganador">Ha ganado el jugador {{ganador}}</div>
    </div>
</template>


<script>
import { mapState } from 'vuex';

export default {
    name: "NavBarPpal",
    computed:{
        ...mapState({
            ganador: state => state.ganador
    })
    },
}

</script>

<style scoped>

.container-navbar{
    border: 5px solid #E480FF;
    border-radius: 100px;
    background-color: #5C0075;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 50px;
    padding: 0.3rem 25px;
    margin-bottom: 1rem;
}


.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 40px;
}

.logo-span{
    font-weight: 700px;
    font-family: monospace;
    font-size: 1.3rem;
    color: aliceblue;
}

.proclamacion-ganador{
    justify-self: center;
    border: 2px solid azure;
    border-radius: 85px;
    margin-left: 18rem;
    color: #5C0075;
    background-color: #10CC93;
    font-size: 1rem;
    padding: 0.3rem;
}





</style>