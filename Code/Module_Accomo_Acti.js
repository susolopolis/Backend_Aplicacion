
/**
 * @apiName Modulo de Obtencion de Alojamiento y Actividades
 * Modulo para Obtención del alojamiento y las actividades del Paquete.
 *
 * Este modulo se encargará de obtener las distintas opciones de alojamiento disponibles para el destino, asi
 * como de las distintas actividades asociadas al mismo
 * @Author Jesus Navarro Hernandez
 * @date 23/04/2021
 */
const http = require("https");
modulo_checker = require('./Module_Checker')

var resultado_id; //!< Variable para almacenar el resultado de la peticion de cara a obtener el ID del lugar
var resultado_hoteles; //!< Variable para almacenar el resultado final del alojamiento
let cuerpodeResultado; //!< Variable para almacenar el cuerpo del resultado JSON de la llamada
var place_to_search; //!< Variable para almacenar el lugar de destino


var interest =[];//!< Variable para almacenar el resultado de las actividades

/**
 * @brief Funcion para obtener el ID necesario de un lugar
 * @param place lugar cuyo ID deseamos obtener
 * @return resultado_id Identificador usado por la API asociado el lugar, si existe.
 */

function initiate_ids(place){
    place_to_search = place;
    const options = {
        "method": "GET",
        "hostname": "hotels-com-provider.p.rapidapi.com",
        "port": null,
        "path": get_place(),
        "headers": {
            "x-rapidapi-key": "f8c651997amsh404363d19719274p10d9abjsn4e754b6ac505",
            "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com",
            "useQueryString": true
        }
    };

    /**
     * Comenzamos definiendo la variable options que contiene la informacion necesaria para la peticion
     * */


    /**
     * @brief Funcion que devuelve la promesa con el ID resuelto
     * @return get_place_id().place_id Identificador obtenido.
     */

    function promesa_id() {
        return new Promise((resolve, reject) => {
            try {
                const req = http.request(options, function (res) {
                    const chunks = [];

                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });

                    res.on("end", function () {
                        const body = Buffer.concat(chunks);
                        cuerpodeResultado = JSON.parse(body);
                        resultado_id = body.toString();
                        getInterestingPlaces()
                        resolve(getPlaceID());
                    });
                });
                req.end();
            }catch (error){
                throw error;
            }
        });
    }
    /**
     * @brief Funcion que devuelve el path para la peticion en funcion del lugar
     *  @return path Direccion para realizar la peticion.
     */

    function get_place() {
        var path = "/v1/destinations/search?locale=en_US&currency=USD&query=";
        /**
         * Comprobamos que las variables necesarias estan correctamente inicializadas
         * */
        try {
            modulo_checker.check_variable(place_to_search,"string")
        }catch (error){
            throw error;
        }
        path += place_to_search;
        return path;
    }
    /**
     * @brief Funcion para obtener las actividades relacionadas con el destino, almacenandolas en la variable interest
     */

    function getInterestingPlaces(){
        let latitude = "";
        let longitude = "";
        let name ="";
        
        for(let i=0;i<cuerpodeResultado.suggestions[2].entities.length;i++){
            name = cuerpodeResultado.suggestions[2].entities[i].name;
            longitude = cuerpodeResultado.suggestions[2].entities[i].longitude;
            latitude = cuerpodeResultado.suggestions[2].entities[i].latitude;

             var aux = {
                  name: name,
                  latitude: latitude,
                  longitude: longitude
              }
              interest.push(aux);
         }
    }

    /**
     * @brief Funcion para obtener el identificador del destino
     * @return place_id identificador del lugar
     */
    function getPlaceID(){
        for(let i=0;cuerpodeResultado.suggestions[0].entities.length;i++){
            if(cuerpodeResultado.suggestions[0].entities[i].name === place_to_search){
                return cuerpodeResultado.suggestions[0].entities[i].destinationId;
            }
        }
    }

    return get_res();
    /**
     * @brief Funcion que llama a la promesa y obtiene el ID
     * @return resultado_id identificador del lugar
     */
    async function get_res() {
        resultado_id = await promesa_id();
        return resultado_id;
    }
}

////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

/**
 * @brief Funcion para obtener los alojamientos en el destino
 * @param adults Numero de adultos
 * @param ci   Fecha de llegada
 * @param co   Fecha de salida
 * @param dest_id   Identificador del lugar
 * @param sort_order Ordenacion para la peticion
 * @return hoteles Lista de alojamientos.
 */

function initiate_hotel(adults,ci,co,dest_id,sort_order){
    const options = {
        "method": "GET",
        "hostname": "hotels-com-provider.p.rapidapi.com",
        "port": null,
        "path": get_place(),
        "headers": {
            "x-rapidapi-key": "f8c651997amsh404363d19719274p10d9abjsn4e754b6ac505",
            "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com",
            "useQueryString": true
        }
    };

    /**
     * Comenzamos definiendo la variable options que contiene la informacion necesaria para la peticion
     * */


    /**
     * @brief Funcion que devuelve la promesa con la informacion del alojamiento
     * @return get_hotels_info().hoteles Lista de alojamientos
     */
    function promesa_hotel() {
        return new Promise((resolve, reject) => {
            try {
                const req = http.request(options, function (res) {
                    const chunks = [];

                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });

                    res.on("end", function () {
                        const body = Buffer.concat(chunks);
                        resultado_hoteles =  JSON.parse(body);
                        resolve(getHotelsInfo());
                    });
                });
                req.end();
            }catch (error){
                throw error;
            }
        });
    }

    /**
     * @brief Funcion que devuelve el path para la peticion
     * @return path Path.
     */

    function get_place() {
        var path = "/v1/hotels/search?adults_number="

        /**
         * Comprobamos que las variables necesarias estan correctamente inicializadas
         * */

        try {
            modulo_checker.check_variable(adults,"number")
            modulo_checker.check_variable(ci,"string")
            modulo_checker.check_variable(co,"string")
            modulo_checker.check_variable(dest_id,"string")
            modulo_checker.check_variable(sort_order,"string")
        }catch (error){
            throw error;
        }

        path += adults +"&checkin_date="+ci+"&destination_id="+dest_id+"&checkout_date="+co+"&currency=USD&locale=en_US&sort_order="+sort_order;
        return path;
    }

    /**
     * @brief Funcion que obtiene la informacion de los alojamientos del resultado de la peticion
     * @return hoteles Lista de alojamientos
     */

    function getHotelsInfo() {
        let hoteles=[];
        for (let i = 0; i < resultado_hoteles.searchResults.results.length; i++) {
            var aux = {
                id: resultado_hoteles.searchResults.results[i].id,
                name: resultado_hoteles.searchResults.results[i].name,
                Star_rating: resultado_hoteles.searchResults.results[i].starRating,
                address: "Latitude: " + resultado_hoteles.searchResults.results[i].coordinate.lat + " Longitude: " + resultado_hoteles.searchResults.results[i].coordinate.lon,
                guest_rating: resultado_hoteles.searchResults.results[i].guestReviews.rating,
                scale: resultado_hoteles.searchResults.results[i].guestReviews.scale,
                current_price:resultado_hoteles.searchResults.results[i].ratePlan.price.current
            };
            hoteles.push(aux);
        }
        return hoteles;
    }
    return get_hot();
    /**
     * @brief Funcion que llama a la promesa y obtiene los alojamientos
     * @return hoteles resultado de la promesa
     */
    async function get_hot() {
        return await promesa_hotel();
    }
}
/**
 * @brief Funcion que llama a los metodos anteriores para obtener el ID del lugar para, a continuacion, obtener el listado de alojamientos
 */
exports.get_acco_pack = async (place,adults,ci,co) => {
    try {
        var id_destiny = await initiate_ids(place);
        resultado_hoteles = await initiate_hotel(adults, ci, co, id_destiny, "GUEST_RATING");
    }catch (error){
        throw error;
    }
}
/**
 * @brief Funcion que devuelve el listado de los alojamientos
 * @return resultado_hoteles listado de alojamientos
 */
exports.get_hotels =  () =>{
    return resultado_hoteles;
}
/**
 * @brief Funcion que devuelve el listado de lugares de interes
 * @return interest listado de lugares de interes
 */
exports.get_interest =  () =>{
    return interest;}


