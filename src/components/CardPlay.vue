<template>
    <div class="card" >
        <div class="container-titulo">
            <div class="titulo"><span>{{ datosCarta.title}}</span></div>
        </div>
        <div v-if="mostrarFecha" class="fecha"><span>{{ datosCarta.date }}</span></div>
    </div>
</template>   

<script>

export default{
    name: "CardPlay",
    data(){
        return {
            //isVisibleDate: true,
            cardSeleccionada: false,
        }
    },
    props: {
        datosCarta: {
            type: Object,
            required: true
        },
        mostrarFecha: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        changeVisibilityDate(){
            this.isVisibleDate = !this.isVisibleDate;
        },


    }
}
</script>


<style scoped>
.card{
    border: 5px solid #5C0075;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: fit-content;
    max-width: 100%;
    padding-bottom: 5px;
    padding-left: 1px ;
    padding-right: 1px;
    background-color: #E480FF;
    /*
    justify-content: space-between;*/
}



.container-titulo{
    width: 200px;
    height: 250px;
}

.titulo{
    border: 2px solid #5C0075;
    border-radius: 10px;
    background-color: azure;
    margin-top: 30%;
}

.titulo span {
    word-wrap: break-word;
}


div span {
    font-family: monospace;
    font-size: 18px;
}


</style>