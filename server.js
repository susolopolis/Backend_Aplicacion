let express = require('express')
let http = require('http')
let app = express()
paquetes = require('./Code/app')

/**
 * @brief Peticion para obtener los paquetes y su informacion
 */

app.get('/packs',async (req, res) => {
    let result = await get_data();
    res.send(result);
    return res;
})

async function get_data(){
    let result = await paquetes.get_packs();
    return result;
}

http.createServer(app).listen(8000, () => {
    console.log('Server started at http://localhost:8000');
});