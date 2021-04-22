const {sequelize,Personas,Pack, Transporte,Accomodation,Activity } = require('./models')
modulo_acco_acti=require ('./Module_Accomo_Acti')
modulo_transporte=require ('./Module_Trans')


var hotels;
var interested_places;
var flight;
var packs = [];

var origin ="Madrid";
var destiny="London";
var adults=1;
var check_in_date="2021-05-10";
var check_out_date="2021-05-15";


async function initiate_table(){
    await sequelize.sync();
}

//*************************************************************
//*************************************************************
//**************FUNCIONES PARA ELIMINAR************************
//*************************************************************
//*************************************************************

function erase_user(ID){
    Personas.destroy({
        where: {
            id: ID
        },
        force: true
    })
}

function erase_pack(ID){
    Pack.destroy({
        where: {
            id: ID
        },
        force: true
    })
}

function erase_accomodation(ID){
    Accomodation.destroy({
        where: {
            id: ID
        },
        force: true
    })
}

function erase_transport(ID){
    Transporte.destroy({
        where: {
            id: ID
        },
        force: true
    })
}

function erase_activity(ID){
    Activity.destroy({
        where: {
            id: ID
        },
        force: true
    })
}

//*************************************************************
//*************************************************************
//*************************************************************

async function create_user(){
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
}
//*************************************************************
//*************************************************************
//**************FUNCION PARA GUARDAR PAQUETE*******************
//*************************************************************
//*************************************************************

async function save_pack(pack){
    var activities='';

    for(var i=0;i<pack.places.length;i++){
        activities+=pack.places[i].name;
        if(i<pack.places.length-1){
            activities+=',';
        }
    }

    const pack_to_save = Pack.create({
        transport: "Flight " + pack.flight.Airline + " from " + pack.flight.City_Origin + " to " + pack.flight.City_Destination + " at " + pack.flight.DepartureDate, //Vamos a identificar el vuelo con origen + destino + fecha ida
        accomodation: pack.hotel.name,
        activities: activities,
        price: pack.price
    })

    save_transport(pack.flight)
    save_accomodation(pack.hotel)
    save_activity(pack.places)
}

//*************************************************************
//*************************************************************
//*************************************************************

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


async function show_users(){
    const personas = await Personas.findAll();
    console.log(personas);
}

async function show_packs(){
    const packs = await Pack.findAll();
    console.log(packs);
}

async function show_transport(){
    const transport = await Transporte.findAll();
    console.log(transport);
}

async function show_accomodation(){
    const accomodation = await Accomodation.findAll();
    console.log(accomodation);
}

async function show_activity(){
    const activity = await Activity.findAll();
    console.log(activity);
}

//*************************************************************
//*************************************************************
//******************CREADOR DE PAQUETES************************
//*************************************************************
//*************************************************************

async function get_module_acco_acti_info() {
    await modulo_acco_acti.get_acco_pack(destiny,adults,check_in_date,check_out_date);
    await modulo_transporte.get_trans_pack(origin,destiny,check_in_date,check_out_date);

    hotels = modulo_acco_acti.get_hotels();
    interested_places = modulo_acco_acti.get_interest();
    flight = await modulo_transporte.get_transport();

    for(var i=0;i<hotels.length;i++){
        create_pack(hotels[i]);
    }
}

function create_pack(hotel){
    var nuevo_pack = {
        hotel:hotel,
        flight:flight,
        places:interested_places,
        price:calculate_total_price(hotel)
    }
    packs.push(nuevo_pack);
}

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

function compare_pack_table(){
    const packs = await Pack.findAll({      //Falta por acabar esta funcion que comprueba que en la tabla existen packs que se ajustan a los campos especificados
        where : {

        }
    });
}
async function main(){
    initiate_table();
//create_user();
//erase_user(4);
   // await get_module_acco_acti_info();
   // save_pack(packs[0]);
    show_packs();
    //show_transport()
   // show_accomodation()
    //show_activity()
}

main();
