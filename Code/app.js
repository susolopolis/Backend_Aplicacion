
module_pack=require ('./Module_Pack_Generator')

var mysql = require('mysql');

function create_conection() {
    var conexion = mysql.createConnection({
        host: 'localhost',
        database: 'backend_pack2flydb',
        user: 'root',
        password: null,
    });

    conexion.connect(function (err) {
        if (err) {
            console.error('Error de conexion: ' + err.stack);
            return;
        }
        console.log('Conectado con el identificador ' + conexion.threadId);
    });
}

exports.get_packs = async () =>{
    create_conection();
    let packs=await module_pack.main();
    return packs;
}
