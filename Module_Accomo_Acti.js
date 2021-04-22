const http = require("https");

var resultado_id;
var resultado_hoteles;
var place_to_search;


var interest =[];
var hotel = {
    id : String,
    name : String,
    Star_rating : String,
    address : String,
    guest_rating : String,
    scale : String,
    current_price : String
}

function initiate_ids(place){
    place_to_search = place;
    const options = {
        "method": "GET",
        "hostname": "hotels-com-provider.p.rapidapi.com",
        "port": null,
        "path": get_place(),
        "headers": {
            "x-rapidapi-key": "f1437027d0msh29390ccc3de5e5ep17f081jsndb3b1a2bd225",
            "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com",
            "useQueryString": true
        }
    };

    function promesa_id() {
        return new Promise((resolve, reject) => {
            const req = http.request(options, function (res) {
                const chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    const body = Buffer.concat(chunks);
                    resultado_id = body.toString();
                    get_intersting_places();
                    resolve(get_place_id());
                });
            });
            req.end();
        });
    }

    function get_place() {
        var path = "/v1/destinations/search?locale=en_US&currency=USD&query=";
        path += place_to_search;
        return path;
    }

    function get_intersting_places() {
        var global_stop = false;
        for (var i = 0; (i < resultado_id.length)&&(global_stop == false); i++) {
            if (resultado_id[i] == "\"") {
                var partial = "";
                var j = i + 1;
                while ((resultado_id[j] != "\"") && (j < resultado_id.length)) {
                    partial += resultado_id[j];
                    j++;
                }
                var latitude = "";
                var longitude = "";
                var name ="";
                stop = false;
                j++;
                if (partial == "LANDMARK_GROUP") {
                    while (partial != "TRANSPORT_GROUP") {
                        j++;
                        var stop = false;
                        while ((j < resultado_id.length) && (stop == false)) {
                            partial ="";
                            while ((resultado_id[j] != "\"") && (j < resultado_id.length)) {
                                partial += resultado_id[j];
                                j++;
                            }
                            switch (partial) {
                                case "name":
                                    j = j + 3;
                                    var aux = "";
                                    while (resultado_id[j] != "\"") {
                                        aux += resultado_id[j];
                                        ++j;
                                    }
                                    name = aux;
                                    stop = true;
                                    break;
                                case "latitude":
                                    j = j + 2;
                                    var aux = "";
                                    while (resultado_id[j] != ",") {
                                        aux += resultado_id[j];
                                        ++j;
                                    }
                                    latitude = aux;
                                    break;
                                case "longitude":
                                    j = j + 2;
                                    var aux = "";
                                    while (resultado_id[j] != "\"") {
                                        aux += resultado_id[j];
                                        ++j;
                                    }
                                    longitude = aux;
                                    break;
                                case "TRANSPORT_GROUP":
                                    stop = true;
                                    global_stop = true;
                                    break;
                            }
                            j++;
                        }
                        var aux = {
                            name: name,
                            latitude: latitude,
                            longitude: longitude
                        }

                        if(global_stop != true) {
                            interest.push(aux);
                        }
                    }
                }
            }
        }
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

                if (partial == "destinationId") {
                    j = j + 3;
                    while (resultado_id[j] != "\"") {
                        place_id += resultado_id[j];
                        ++j;
                    }
                    j = j+3;
                    while (partial != "name") {
                        partial ="";
                        while ((resultado_id[j] != "\"") && (j < resultado_id.length)) {
                            partial += resultado_id[j];
                            j++;
                        }
                        j = j+1;
                    }
                    j = j+2;
                    while (resultado_id[j] != "\""){
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

////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function initiate_hotel(adults,ci,co,dest_id,sort_order){
    const options = {
        "method": "GET",
        "hostname": "hotels-com-provider.p.rapidapi.com",
        "port": null,
        "path": get_place(),
        "headers": {
            "x-rapidapi-key": "f1437027d0msh29390ccc3de5e5ep17f081jsndb3b1a2bd225",
            "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com",
            "useQueryString": true
        }
    };

    function promesa_hotel() {
        return new Promise((resolve, reject) => {
            const req = http.request(options, function (res) {
                const chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    const body = Buffer.concat(chunks);
                    resultado_hoteles = body.toString();
                    resolve(get_hotels_info());
                });
            });
            req.end();
        });
    }
    function get_place() {
        var path = "/v1/hotels/search?adults_number="//"/v1/hotels/search?adults_number=1&checkin_date=2022-03-26&destination_id=1708350&checkout_date=2022-03-27&currency=USD&locale=en_US&sort_order=STAR_RATING_HIGHEST_FIRST";
        path += adults +"&checkin_date="+ci+"&destination_id="+dest_id+"&checkout_date="+co+"&currency=USD&locale=en_US&sort_order="+sort_order;
        return path;
    }

    function get_hotels_info() {
        for (var i = 0; i < resultado_hoteles.length; i++) {
            if (resultado_hoteles[i] == "\"") {
                var partial = "";
                var j = i + 1;
                while ((resultado_hoteles[j] != "\"") && (j < resultado_hoteles.length)) {
                    partial += resultado_hoteles[j];
                    j++;
                }
                if (partial == "results") {
                    let hoteles =[];
                    for (var i = 0; i < resultado_hoteles.length; i++) {
                        partial = "";
                        j = j + 5;
                        var stop = false;
                        while (stop != true) {
                            while ((resultado_hoteles[j] != "\"") && (j < resultado_hoteles.length)) {
                                partial += resultado_hoteles[j];
                                j++;
                            }
                            switch (partial) {
                                case "name" :
                                    j = j + 3;
                                    var aux = "";
                                    while (resultado_hoteles[j] != "\"") {
                                        aux += resultado_hoteles[j];
                                        ++j;
                                    }
                                    hotel.name = aux;
                                    break;
                                case "starRating" :
                                    j = j + 2;
                                    var aux = "";
                                    while (resultado_hoteles[j] != "\,") {
                                        aux += resultado_hoteles[j];
                                        ++j;
                                    }
                                    hotel.Star_rating = aux;
                                    break;
                                case "id" :
                                    j = j + 2;
                                    var aux = "";
                                    while (resultado_hoteles[j] != ",") {
                                        aux += resultado_hoteles[j];
                                        ++j;
                                    }
                                    hotel.id = aux;
                                    break;
                                case "streetAddress":
                                    j = j + 3;
                                    var aux = "";
                                    while (resultado_hoteles[j] != "\"") {
                                        aux += resultado_hoteles[j];
                                        ++j;
                                    }
                                    hotel.address = aux;
                                    break;
                                case "rating" :
                                    j = j + 3;
                                    var aux = "";
                                    while (resultado_hoteles[j] != "\"") {
                                        aux += resultado_hoteles[j];
                                        ++j;
                                    }
                                    hotel.guest_rating = aux;
                                    break;
                                case "scale":
                                    j = j + 2;
                                    var aux = "";
                                    while (resultado_hoteles[j] != ",") {
                                        aux += resultado_hoteles[j];
                                        ++j;
                                    }
                                    hotel.scale = aux;
                                    break;
                                case "current" :
                                    j = j + 3;
                                    var aux = "";
                                    while (resultado_hoteles[j] != "\"") {
                                        aux += resultado_hoteles[j];
                                        ++j;
                                    }
                                    hotel.current_price = aux;
                                    stop = true;
                                    break;
                            }
                            partial = "";
                            j++;
                            if (j >= resultado_hoteles.length){
                                stop=true;
                            }
                        }
                        var aux = {
                            id : hotel.id,
                            name : hotel.name,
                            Star_rating : hotel.Star_rating,
                            address : hotel.address,
                            guest_rating : hotel.guest_rating,
                            scale : hotel.scale,
                            current_price : hotel.current_price};

                        hoteles.push(aux);
                        i = j;
                        //console.log(aux)
                    }
                    return hoteles;
                }
            }
        }
    }
    return get_hot();

    async function get_hot() {
        return await promesa_hotel();
    }
}

exports.get_acco_pack = async (place,adults,ci,co) => {
    var id_destiny = await initiate_ids(place);
    resultado_hoteles = await initiate_hotel(adults,ci, co, id_destiny, "GUEST_RATING");
}

exports.get_hotels =  () =>{
    return resultado_hoteles;
}

exports.get_interest =  () =>{
    return interest;
}





