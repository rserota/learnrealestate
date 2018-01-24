var nullPass = function(obj){
    if (obj){
        obj.password = null;
        return obj
    }
    else{
        return null
    }
}

module.exports = nullPass;
