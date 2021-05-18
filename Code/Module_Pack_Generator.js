/**
 * @apiName Generador del Paquetes
 * Encargado de lageneracion de paquetes.
 *
 * La aplicacion hara uso de los modulos adicionales para crear los paquetes.
 *
 * @Author Jesus Navarro Hernandez
 * @date 23/04/2021
 */

modulo_acco_acti=require ('./Module_Accomo_Acti')
modulo_transporte=require ('./Module_Trans')
modulo_tabla = require ('./Modulo_Tablas')
modulo_checker = require('./Module_Checker')


var hotels; //!< Variable donde vamos a almacenar los hoteles
var interested_places;//!< Variable para almacenar los lugares de interes
var flight; //!< Variable para almacenar el vuelo
var packs = []; //!< Variable para almacenar los paquetes creados

var origin ="London"; //!< Variable que contiene el origen
var destiny="Madrid"; //!< Variable que contiene el destino
var adults=1;//!< Variable que contiene el numero de adultos
var check_in_date="2021-05-20"; //!< Variable que contiene la fecha de llegada
var check_out_date="2021-05-25";//!< Variable que contiene la fecha de salida

//*************************************************************
//*************************************************************
//******************CREADOR DE PAQUETES************************
//*************************************************************
//*************************************************************
/**
 * @brief Funcion para obtener e inicializar las variables de transporte, alojamiento y actividades correspondientes haciendo
 * uso de los modulos
 */
async function get_module_acco_acti_info() {
    try{
        modulo_checker.check_variable(origin,"string");
        modulo_checker.check_variable(destiny,"string");
        modulo_checker.check_variable(adults,"number");
        modulo_checker.check_variable(check_in_date,"string");
        modulo_checker.check_variable(check_out_date,"string");
    }catch (error){
        throw error;
    }

    await modulo_acco_acti.get_acco_pack(destiny, adults, check_in_date, check_out_date);
    await modulo_transporte.get_trans_pack(origin, destiny, check_in_date, check_out_date);

    hotels = modulo_acco_acti.get_hotels();
    interested_places = modulo_acco_acti.get_interest();
    flight = await modulo_transporte.get_transport();

    try {
        modulo_checker.check_variable(hotels,"object")
        modulo_checker.check_variable(interested_places,"object")
        modulo_checker.check_variable(flight,"object")
    }catch (error){
        console.error(error);
    }
    /**
     * Creamos el paquete por cada opcion de alojamiento
     * */
    for(var i=0;i<hotels.length;i++){
        create_pack(hotels[i]);
    }
}
/**
 * @brief Funcion para crear el paquete
 * @param hotel objeto de alojamiento para crear el paquete
 */
function create_pack(hotel){
    var nuevo_pack = {
        hotel:hotel,
        flight:flight,
        places:interested_places,
        price:calculate_total_price(hotel)
    }
    packs.push(nuevo_pack);
}

/**
 * @brief Funcion para calcular el precio total del paquete, sumando los precios individuales
 * @param hotel objeto de alojamiento del paquete
 */
function calculate_total_price(hotel){
    var price;
    var aux="";
    for(var i=0;i<hotel.current_price.length;i++){
        if(hotel.current_price[i]!="$"){
            aux += hotel.current_price[i];
        }
    }
    price = parseInt(aux);
    price += flight.minPrice;
    return price.toString();
}

/**
 * @brief Funcion main que ejecuta la aplicacion de backend (en este caso, simula la creacion de los paquetes, almacena uno y muestra la tabla)
 */
exports.main = async () =>{

    //create_user();
    //erase_user(4);
    await get_module_acco_acti_info();
    return packs;
    //modulo_tabla.show_packs();
    //compare_pack_table()
    //show_transport()
    // show_accomodation()
    //show_activity()
}

