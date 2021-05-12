/**
 * @apiName Modulo de Obtencion del Transporte
 * Modulo para Obtención del Transporte del Paquete.
 *
 * Este modulo se encargará de obtener los identificadores usados por la API SkyScanner para,
 * posteriormente, realizar la búsqueda en la misma con los parámetros recibidos. Inicializará
 * el objeto correspondiente y permitirá que otros módulos accedan a su información.
 *
 * @Author Jesus Navarro Hernandez
 * @date 23/04/2021
 */

const http = require("https");
modulo_checker = require('./Module_Checker')

var resultado_id; //!< Variable para almacenar el resultado de la peticion de cara a obtener los IDs

var resultado; //!< Variable para almacenar el resultado de la peticion de transporte

var place_to_search;//!< Variable para almacenar el lugar a buscar

var transport = {
    minPrice : String,
    Direct : Boolean,
    DepartureDate: String,
    Airline: String,
    LandMarkName_Origin: String,
    LandMarkName_Destination: String,
    Country_Origin: String,
    Country_Destination: String,
    City_Origin: String,
    City_Destination: String
};  //!< Variable donde guardaremos el resultado total del vuelo para poder usarlo en la aplicacion

//*************************************************************
//*************************************************************
//**********FUNCION PARA OBTENER EL ID DE UN LUGAR*************
//*************************************************************
//*************************************************************

var path
/**
 * @brief Funcion para obtener el ID necesario de un lugar
 * @param place lugar cuyo ID deseamos obtener
 * @return resultado_id Identificador usado por la API asociado el lugar, si existe.
 */

initiate_ids = (place) => {
    place_to_search = place; //!< Variable para almacenar el valor del lugar a buscar
    const options = {       //variable para realizar la peticion, aportada por la API
        "method": "GET",
        "hostname": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "port": null,
        "path": get_place(),//"/apiservices/autosuggest/v1.0/US/USD/en-US/?query=London",
        "headers": {
            "x-rapidapi-key": "f8c651997amsh404363d19719274p10d9abjsn4e754b6ac505",
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
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
                        resultado_id = JSON.parse(body);
                        resolve(getPlaceId());
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
     * @return path Direccion para realizar la peticion.
     */

    function get_place() {
        var path = "/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" + place_to_search;


        /**
         * Comprobamos que las variables necesarias estan correctamente inicializadas
         * */

        try {
            modulo_checker.check_variable(place_to_search,"string");
        }catch (error){
            throw error;
        }
        return path;
    }

    /**
     * @brief Funcion que devuelve el valor identificativo del lugar
     * @return place_id ID del lugar.
     */

    function getPlaceId() {
        return resultado_id.Places[0].PlaceId;
    }

    return get_res();

    /**
     * @brief Funcion que que realiza la operacion de llamar a la funcion promesa y devolver el valor de la funcion global
     * @return resultado_id Valor del identificador.
     */

    async function get_res() {
        resultado_id = await promesa_id();
        return resultado_id;
    }
}

/**
 * @brief Funcion que obtiene la informacion de la peticion sobre el vuelo y la almacena en la variable correspondiente transport
 * @return get_rest.transport Copia de la variable transport.
 */

initiate_tra = (id_origin,id_destiny,check_in,check_out) => {
    /**
     * Comenzamos definiendo la variable options que contiene la informacion necesaria para la peticion
     * */
    const options = {  //variable para realizar la peticion, aportada por la API
        "method": "GET",
        "hostname": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "port": null,
        "path": get_path_tra(),//"/apiservices/browsequotes/v1.0/US/USD/en-US/SFO-sky/JFK-sky/2021-09-01?inboundpartialdate=2021-12-01",
        "headers": {
            "x-rapidapi-key": "f8c651997amsh404363d19719274p10d9abjsn4e754b6ac505",
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "useQueryString": true
        }
    };

    /**
     * @brief Funcion que devuelve el path para la peticion
     * @return path path para la peticion
     */

    function get_path_tra() {
        var path = "/apiservices/browsequotes/v1.0/US/USD/en-US/"; //Por defecto, en ingles y en dolares
        var ci = check_in;
        var co = check_out;
        /**
         *
         * Comprobamos que las variables necesarias estan correctamente inicializadas
         * */
        try {
            modulo_checker.check_variable(ci,"string")
            modulo_checker.check_variable(co,"string")
        }catch (error){
            throw error;
        }

        return path += id_origin + "/" + id_destiny + "/" + ci + "?" + "inboundpartialdate=" + co;
    }
    /**
     * @brief Funcion que devuelve la promesa con la informacion del transporte
     * @return get_transport_info.transport Información del transporte.
     */

    function promesa_tra() {
        return new Promise((resolve, reject) => {
            try {
                const req = http.request(options, function (res) {
                    const chunks = [];

                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });

                    res.on("end", function () {
                        const body = Buffer.concat(chunks);
                        resultado = JSON.parse(body);
                        resolve(get_transport_info());
                    });
                });
                req.end();
            }catch (error){
                throw error;
            }
        });
    }

    /**
     * @brief Funcion que realiza la operacion de tratar la informacion obtenida en la peticion y obtener la informacion relevante
     * @return transport Copia del valor de la variable transport.
     */

    function get_transport_info(){
        transport.minPrice = resultado.Quotes[0].MinPrice;
        transport.Direct = resultado.Quotes[0].Direct;
        transport.DepartureDate = resultado.Quotes[0].OutboundLeg.DepartureDate;
        transport.City_Origin = resultado.Places[1].Name;
        transport.City_Destination = resultado.Places[2].Name;
        transport.Country_Origin = resultado.Places[1].CountryName;
        transport.Country_Destination = resultado.Places[2].CountryName;
        transport.Airline = resultado.Carriers[0].Name
        transport.LandMarkName_Origin = resultado.Places[1].Name;
        transport.LandMarkName_Destination = resultado.Places[2].Name;
        return transport;
    }

    return get_res();

    /**
     * @brief Funcion que realiza la operacion de llamar a la funcion promesa y devolver el valor de la funcion global
     * @return transport Valor del transporte.
     */
    async function get_res() {
        transport = await promesa_tra();
        return transport;
    }
}

/**
 * @brief Funcion exportable que se encarga de realizar la distintas tareas: llamar a la funcion de obtencion de ids para
 * los dos lugares (destino y origen) y una vez obtenidos, llama a la funcion encargada de obtener la informacion, almacenando
 * la misma en transport
 */
exports.get_trans_pack= async (origin,destiny,check_in_date,check_out_date)  => {
    try {
        var id_destiny = await initiate_ids(destiny);
        var id_origin = await initiate_ids(origin);

        var tran_info = await initiate_tra(id_origin, id_destiny, check_in_date, check_out_date);
        transport = tran_info;
    }catch (error){
        throw error;
    }
}

/**
 * @brief Funcion exportable que devuelve el valor de transporte
 * @return transport Valor del transporte.
 */
exports.get_transport = async ()  => {
    return transport;
}
