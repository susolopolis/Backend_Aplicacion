//*************************************************************
//*************************************************************
//*******FUNCIONES PARA COMPROBAR INTEGRIDAD DE VARIABLES******
//*************************************************************
//*************************************************************


function check_undefined(variable){
    if(variable == undefined){
        throw "Error: " + variable + " is undefined";
    }
}

function check_type(variable,type){
    if(typeof variable != type){
        throw "Error: " + variable + " is not a "+ type +", is a "+ typeof variable;
    }
}

exports.check_variable = (variable,type) =>{
    try{
        check_undefined(variable)
        check_type(variable,type)
    }catch (error){
        throw error;
    }
}