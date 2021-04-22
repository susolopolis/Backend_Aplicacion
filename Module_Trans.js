
const http = require("https");

var resultado_id;
var resultado;

var place_to_search;

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
};

var counter = 0;
var counter_2 =0;
var counter_3 = 0;


initiate_ids = (place) => {
    place_to_search = place;
    const options = {
        "method": "GET",
        "hostname": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "port": null,
        "path": get_place(),//"/apiservices/autosuggest/v1.0/US/USD/en-US/?query=London",
        "headers": {
            "x-rapidapi-key": "f1437027d0msh29390ccc3de5e5ep17f081jsndb3b1a2bd225",
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "useQueryString": true
        }
    };

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
                        resultado_id = body.toString();
                        resolve(get_place_id());
                    });
                });
                req.end();
            }catch (error){
                throw error;
            }
        });
    }

    function get_place() {
        var path = "/apiservices/autosuggest/v1.0/US/USD/en-US/?query=";

        if((place_to_search==undefined)||(typeof place_to_search != "string")){
            throw "Error: place_to_search is not defined!"
        }
        else {
            path += place_to_search;
        }
        return path;
    }

    function get_place_id() {
        for (var i = 0; i < resultado_id.length; i++) {
            if (resultado_id[i] == "\"") {
                var partial = "";
                var j = i + 1;
                while ((resultado_id[j] != "\"") && (j < resultado_id.length)) {
                    partial += resultado_id[j];
                    j++;
                }
                var place_id = "";
                var place_name = "";
                if (partial == "PlaceId") {
                    j = j + 5;
                    while (resultado_id[j] != "\"") {
                        place_id += resultado_id[j];
                        ++j;
                    }
                    j = j + 22;
                    while (resultado_id[j] != "\"") {
                        place_name += resultado_id[j];
                        j++;
                    }
                    if (place_name == place_to_search) {
                        return place_id;
                    }
                }
                i = j;
            }
        }
    }
    return get_res();

    async function get_res() {
        resultado_id = await promesa_id();
        return resultado_id;
    }
}

initiate_tra = (id_origin,id_destiny,check_in,check_out) => {
    const options = {
        "method": "GET",
        "hostname": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        "port": null,
        "path": get_path_tra(),//"/apiservices/browsequotes/v1.0/US/USD/en-US/SFO-sky/JFK-sky/2021-09-01?inboundpartialdate=2021-12-01",
        "headers": {
            "x-rapidapi-key": "f1437027d0msh29390ccc3de5e5ep17f081jsndb3b1a2bd225",
            "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            "useQueryString": true
        }
    };

    function get_path_tra() {
        var path = "/apiservices/browsequotes/v1.0/US/USD/en-US/"; //Por defecto, en ingles y en dolares
        var ci = check_in;
        var co = check_out;

        if((ci==undefined)|| (typeof ci !="string")){
            throw "Error:check_in_date is not defined!"
        }
        if((co==undefined)|| (typeof co !="string")){
            throw "Error:check_out_date is not defined!"
        }
        else {
            return path += id_origin + "/" + id_destiny + "/" + ci + "?" + "inboundpartialdate=" + co;
        }
    }

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
                        resultado = body.toString();
                        resolve(get_transport_info());
                    });
                });
                req.end();
            }catch (error){
                throw error;
            }
        });
    }

    function get_transport_info(){
        for (var i = 0; i < resultado.length; i++) {
            if (resultado[i] == "\"") {
                var partial = "";
                var j = i + 1;
                while ((resultado[j] != "\"") && (j < resultado.length)) {
                    partial += resultado[j];
                    j++;
                }
                switch (partial) {
                    case "MinPrice":
                        j = j + 4;
                        var aux = "";
                        while (resultado[j] != ",") {
                            aux += resultado[j];
                            ++j;
                        }
                        transport.minPrice = parseInt(aux);
                        break;
                    case "Direct":
                        j = j + 4;
                        var aux = "";
                        while (resultado[j] != ",") {
                            aux += resultado[j];
                            ++j;
                        }
                        if (aux == "true") {
                            transport.Direct = true;
                        } else {
                            transport.Direct = false;
                        }
                        break;
                    case "DepartureDate":
                        j = j + 5;
                        var aux = "";
                        while (resultado[j] != "\"") {
                            if (resultado[j] == "T") {
                                aux += " at ";
                            } else {
                                aux += resultado[j];
                            }
                            ++j;
                        }
                        transport.DepartureDate = aux;
                        break;
                    case "CityName":
                        j = j + 5;
                        var aux = "";
                        while (resultado[j] != "\"") {
                            aux += resultado[j];
                            ++j;
                        }
                        if (counter_2 == 0) {
                            transport.City_Origin = aux;
                            counter_2++;
                            break;
                        }
                        if (counter_2 == 1) {
                            transport.City_Destination = aux;
                            counter_2++;
                            break;
                        }

                    case "CountryName":
                        j = j + 5;
                        var aux = "";
                        while (resultado[j] != "\"") {
                            aux += resultado[j];
                            ++j;
                        }
                        if (counter_3 == 0) {
                            transport.Country_Origin = aux;
                            counter_3++;
                            break;
                        }
                        if (counter_3 == 1) {
                            transport.Country_Destination = aux;
                            counter_3++;
                            break;
                        }
                    case "Name":
                        j = j + 5;
                        var aux = "";
                        while (resultado[j] != "\"") {
                            aux += resultado[j];
                            ++j;
                        }
                        if (counter == 0) {
                            transport.Airline = aux;
                            ++counter;
                            break;
                        }
                        if (counter == 1) {
                            transport.LandMarkName_Origin = aux;
                            ++counter;
                            break;
                        }
                        if (counter == 2) {
                            transport.LandMarkName_Destination = aux;
                            ++counter;
                            break;
                        }

                        if (counter == 3) {
                            transport.LandMarkName_Origin = aux;
                            ++counter;
                            break;
                        }

                }
                i = j;
            }
        }
        return transport;
    }
    return get_res();

    async function get_res() {
        transport = await promesa_tra();
        return transport;
    }
}

exports.get_trans_pack= async (origin,destiny,check_in_date,check_out_date)  => {
    try {
        var id_destiny = await initiate_ids(origin);
        var id_origin = await initiate_ids(destiny);

        var tran_info = await initiate_tra(id_origin, id_destiny, check_in_date, check_out_date);
        transport = tran_info;
    }catch (error){
        throw error;
    }
}


exports.get_transport = async ()  => {
    return transport;
}
