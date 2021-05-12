let option = 1;  ///1: Crear paquete 2: Consultar tablas, un número para cada opcion
module_pack=require ('./Module_Pack_Generator')

var mysql = require('mysql');

var conexion= mysql.createConnection({
    host : 'localhost',
    database : 'backend_pack2flydb',
    user : 'root',
    password : null,
});

conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + conexion.threadId);
});

switch (option){
    case 1: module_pack.main();
}


