/**
 * @apiName Aplicacion Principal del Backend
 * Encargado de las interacciones con la base de datos y generacion de paquetes.
 *
 * La aplicacion hara uso de los modulos adicionales para crear los paquetes. Ademas,interactuara
 * con la base de datos para acceder y almacenar la informacion en las tablas correspondientes cuando
 * se requiera.
 *
 * @Author Jesus Navarro Hernandez
 * @date 23/04/2021
 */


const {sequelize,Personas,Pack, Transporte,Accomodation,Activity } = require('./models')
modulo_acco_acti=require ('./Module_Accomo_Acti')
modulo_transporte=require ('./Module_Trans')


var hotels; //!< Variable donde vamos a almacenar los hoteles
var interested_places;//!< Variable para almacenar los lugares de interes
var flight; //!< Variable para almacenar el vuelo
var packs = []; //!< Variable para almacenar los paquetes creados

var origin =process.argv[2]; //!< Variable que contiene el origen
var destiny=process.argv[3]; //!< Variable que contiene el destino
var adults=parseInt(process.argv[4]);//!< Variable que contiene el numero de adultos
var check_in_date=process.argv[5]; //!< Variable que contiene la fecha de llegada
var check_out_date=process.argv[6];//!< Variable que contiene la fecha de salida

/**
 * @brief Funcion que crea las tablas, si no hubieran sido creadas
 */
async function initiate_table(){
    await sequelize.sync();
}

//*************************************************************
//*************************************************************
//*******FUNCIONES PARA COMPROBAR INTEGRIDAD DE VARIABLES******
//*************************************************************
//*************************************************************

/**
 * @brief Function que comprueba si las variables solicitadas tienen un formato adecuado
 */
function check_variables_search(){
    if(origin==undefined){
        throw ("Error: origin is undefined, which means that the search wont be properly performanced");
    }
    if(typeof origin != "string" ){
        throw ("Error: origin is not a String, which means that the search wont be properly performanced");
    }
    if(destiny==undefined){
        throw ("Error: destiny is undefined, which means that the search wont be properly performanced");
    }
    if(typeof destiny != "string" ){
        throw ("Error: destiny is not a String, which means that the search wont be properly performanced");
    }
    if(adults==undefined){
        throw ("Error: adults is undefined, which means that the search wont be properly performanced");
    }
    if(typeof adults != "number" ){
        throw ("Error: destiny is not a number, which means that the search wont be properly performanced");
    }
    if(check_in_date == undefined){
        throw ("Error: check_in_date is undefined, which means that the search wont be properly performanced");
    }
    if(typeof check_in_date != "string" ){
        throw ("Error: check_in_date is not a String, which means that the search wont be properly performanced");
    }
    if(check_out_date == undefined){
        throw ("Error: check_out_date is undefined, which means that the search wont be properly performanced");
    }
    if(typeof check_out_date != "string" ){
        throw ("Error: check_out_date is not a String, which means that the search wont be properly performanced");
    }
}

/**
 * @brief Funcion que se encarga de comprobar que la variable hotels ha sido correctamente inicializada y con un tipo correcto.
 */
function check_hotel_Integrity(){
    if(hotels == undefined){
        throw ("Error: hotels is undefined, which means that packs can´t be offered");
    }
    if(typeof hotels != "object"){
        throw ("Error: hotels type not an array. Unexpected behaviour");
    }
}

/**
 * @brief Funcion que se encarga de comprobar que la variable interested_places ha sido correctamente inicializada y con un tipo correcto.
 */
function check_interested_places_Integrity() {
    if (interested_places == undefined) {
        throw ("Error: interested_places is undefined, which means that packs can´t be offered");
    }
    if (typeof interested_places != "array") {
        throw ("Error: interested_places type not an array. Unexpected behaviour");
    }
}
/**
 * @brief Funcion que se encarga de comprobar que la variable flight ha sido correctamente inicializada y con un tipo correcto.
 */
function check_flight_Integrity(){
    if (flight == undefined) {
        throw ("Error: flight is undefined, which means that packs can´t be offered");
    }
    if (typeof flight != "object") {
        throw ("Error: flight type not an object. Unexpected behaviour");
    }
}
//*************************************************************
//*************************************************************
//**************FUNCIONES PARA ELIMINAR************************
//*************************************************************
//*************************************************************

/**
 * @brief Funcion para eliminar un usuario de la tabla
 * @param ID identificador del usuario
 */
function erase_user(ID){
    try {
        Personas.destroy({
            where: {
                id: ID
            },
            force: true
        })
    }catch (error){
        console.log(erro);
    }
}
/**
 * @brief Funcion para eliminar un pack de la tabla
 * @param ID identificador del pack
 */
function erase_pack(ID){
    try {
    Pack.destroy({
        where: {
            id: ID
        },
        force: true
    })
    }catch (error){
        console.log(erro);
    }
}
/**
 * @brief Funcion para eliminar un alojamiento de la tabla
 * @param ID identificador del alojamiento
 */
function erase_accomodation(ID){
    try {
    Accomodation.destroy({
        where: {
            id: ID
        },
        force: true
    })
    }catch (error){
        console.log(erro);
    }
}
/**
 * @brief Funcion para eliminar un transporte de la tabla
 * @param ID identificador del transporte
 */
function erase_transport(ID){
    try {
    Transporte.destroy({
        where: {
            id: ID
        },
        force: true
    })
    }catch (error){
        console.log(erro);
    }
}
/**
 * @brief Funcion para eliminar un actividad de la tabla
 * @param ID identificador de la actividad
 */
function erase_activity(ID){
    try {
    Activity.destroy({
        where: {
            id: ID
        },
        force: true
    })
    }catch (error){
        console.log(erro);
    }
}

//*************************************************************
//*************************************************************
//*************************************************************

/**
 * @brief Funcion para crear un usuario (aun con datos de ejemplo)
 */
async function create_user(){
    try {
    const persona = Personas.create({
        admin: true,
        email: 'jesuselmister99@gmail.com',
        username: 'Suson99',
        password: 'Jesuselcrack',
        savedPacks: '12,1415,1512',
        puntuation: 9.2,
        profileimage: 'image.jpg',
        lastSeen: new Date(),
        comments: 21
    })
    }catch (error){
        console.log(erro);
    }
}
//*************************************************************
//*************************************************************
//**************FUNCION PARA GUARDAR PAQUETE*******************
//*************************************************************
//*************************************************************
/**
 * @brief Funcion para guardar en la tabla un pack
 * @param pack pack a guardar
 */
async function save_pack(pack){
    var activities='';

    for(var i=0;i<pack.places.length;i++){
        activities+=pack.places[i].name;
        if(i<pack.places.length-1){
            activities+=',';
        }
    }
    /**
     * Almacenamos la informacion en la tabla con un formato transporte,alojamiento,actividades y precio
     * */
    const pack_to_save = Pack.create({
        transport: "Flight " + pack.flight.Airline + " from " + pack.flight.City_Origin + " to " + pack.flight.City_Destination + " at " + pack.flight.DepartureDate, //Vamos a identificar el vuelo con origen + destino + fecha ida
        accomodation: pack.hotel.name,
        activities: activities,
        price: pack.price
    })

    /**
     * Almacenamos a su vez cada uno de los componentes que componen el pack
     * */

    save_transport(pack.flight)
    save_accomodation(pack.hotel)
    save_activity(pack.places)
}

//*************************************************************
//*************************************************************
//*************************************************************
/**
 * @brief Funcion para guardar en la tabla correspondiente el transporte
 * @param transporte objeto de transporte a guardar
 */
async function save_transport(transporte){
    const transport= Transporte.create({
        minPrice: transporte.minPrice,
        direct: transporte.Direct,
        departure: transporte.DepartureDate,
        airline: transporte.Airline,
        landmarkOrigin: transporte.LandMarkName_Origin,
        landmarkDestination: transporte.LandMarkName_Destination,
        countryOrigin: transporte.Country_Origin,
        countryDestination: transporte.Country_Destination,
        cityOrigin: transporte.City_Origin,
        cityDestination: transporte.City_Destination
    })
}
/**
 * @brief Funcion para guardar en la tabla correspondiente el alojamiento
 * @param transporte objeto de alojamiento a guardar
 */
async function save_accomodation(alojamiento){
    const accomodation= Accomodation.create({
        name: alojamiento.name,
        starRating: alojamiento.Star_rating ,
        address: alojamiento.address,
        guestRating: alojamiento.guest_rating,
        scale: alojamiento.scale,
        currentPrice: alojamiento.current_price
    })
}
/**
 * @brief Funcion para guardar en la tabla correspondiente la actividad
 * @param transporte objeto de actividad a guardar
 */
async function save_activity(actividad){
    const activity = Activity.create({
        name: actividad.name,
        latitude: actividad.latitude,
        lotitude: actividad.longitude

    })
}
//*************************************************************
//*************************************************************
//**************FUNCIONES PARA MOSTRAR TABLAS******************
//*************************************************************
//*************************************************************
/**
 * @brief Funcion para mostrar la tabla de usuarios
 */

async function show_users(){
    const personas = await Personas.findAll();
    console.log(personas);
}
/**
 * @brief Funcion para mostrar la tabla de packs
 */
async function show_packs(){
    const packs = await Pack.findAll();
    console.log(packs);
}
/**
 * @brief Funcion para mostrar la tabla de transporte
 */
async function show_transport(){
    const transport = await Transporte.findAll();
    console.log(transport);
}
/**
 * @brief Funcion para mostrar la tabla de alojamientos
 */
async function show_accomodation(){
    const accomodation = await Accomodation.findAll();
    console.log(accomodation);
}
/**
 * @brief Funcion para mostrar la tabla de actividades
 */
async function show_activity(){
    const activity = await Activity.findAll();
    console.log(activity);
}

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
        check_variables_search();
        await modulo_acco_acti.get_acco_pack(destiny, adults, check_in_date, check_out_date);
        await modulo_transporte.get_trans_pack(origin, destiny, check_in_date, check_out_date);



    hotels = modulo_acco_acti.get_hotels();
    interested_places = modulo_acco_acti.get_interest();
    flight = await modulo_transporte.get_transport();

    try {
        check_hotel_Integrity()
        check_flight_Integrity()
        check_interested_places_Integrity()
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

//*************************************************************
//*************************************************************
//*************************************************************

/**
 * @brief Funcion para obtener los paquetes almacenados que cumplen con las condiciones de busqueda, para poder ser ofrecidos tambien a los usuarios
 */
async function compare_pack_table(){
    const packs_table = await Pack.findAll();
    for (var i=0;i<packs_table.length;i++){
        var transport=packs_table[i].transport;
        var split = transport.split(" ");
        for(var z=0;z<split.length;z++){
            if(split[z]=="from"){
                if(split[z+1]==destiny){
                        packs.push(packs_table[i]);
                }
            }
        }
    }
}
/**
 * @brief Funcion main que ejecuta la aplicacion de backend (en este caso, simula la creacion de los paquetes, almacena uno y muestra la tabla)
 */
async function main(){
    //initiate_table();
    //create_user();
    //erase_user(4);
    await get_module_acco_acti_info();
    save_pack(packs[3]);
    show_packs();
    //compare_pack_table()
    //show_transport()
   // show_accomodation()
    //show_activity()
}

main();
