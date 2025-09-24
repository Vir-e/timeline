import axios from 'axios'

class PlayService{
    constructor(){
        this.data = [];
   
    }

    async cargarRegistrosHistoricos(modoJuego){

        let rutaJson = ""

        if(modoJuego === "general"){
            rutaJson = "/data/general.json";
        }
        else if(modoJuego === "inventos"){
            rutaJson = "/data/inventos.json";
        }
        else if(modoJuego === "disney"){
            rutaJson = "/data/disney.json";
        }
        else{
            rutaJson = "/data/inventos.json";
        }

        try{
            const response = await axios.get(rutaJson);
            // Axios parsea el JSON automáticamente y lo pone en response.data
            //console.log("response...", response.data);
            this.data = response.data;
            return this.data;
            } catch (err) {
            this.error = err.message;
            console.error('Error al cargar el archivo JSON:', err);
            }

    }

    async getRegistroHistRandom(){
        // Primero, verificamos que el array no esté vacío para evitar errores
        //console.log("Data:", this.data)
        if (this.data.length === 0) {
            console.warn("No hay más registros para seleccionar.");
            return null;
        }

        // Generamos un índice aleatorio basado en la longitud del array
        const randomIndex = Math.floor(Math.random() * this.data.length);

        // Usamos splice() para eliminar el elemento del array y obtenerlo.
        // splice(índice, cantidad_a_eliminar) devuelve un array con los elementos eliminados.
        const elementoSeleccionado = this.data.splice(randomIndex, 1);
        
        // Devolvemos el primer y único elemento del array devuelto por splice
        //console.log("Elemento:", elementoSeleccionado[0]);
        return elementoSeleccionado[0];
    }

}

export default PlayService;