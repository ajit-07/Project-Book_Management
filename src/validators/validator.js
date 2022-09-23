const isValid=function(value){
    if(typeof value==='undefined' || value===null) {return false}
    if(typeof value==='string' && value.trim().length==0) {return false}
    return true
}

const isValidRating=function(value){
    if(typeof value==='undefined' || value===null) {return false}
    if(typeof value!=='number') {return false}
    if(!Number.isInteger(value)) {return false}
    return true
}

const isValidEnum=function(value){
    if(typeof value==='undefined' || value===null) {return false}
    if(typeof value==='string' && value.trim().length==0) {return false}
    return ['Mr','Mrs','Miss'].indexOf(value)!==-1
}

module.exports={isValid,isValidEnum,isValidRating}