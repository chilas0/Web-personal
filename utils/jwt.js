const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../constans");

//Para crear un access token, para un inicio de sesion de 3 horas 

function createAccessToken(user){
    const expToken = new Date();
    expToken.setHours(expToken.getHours() + 3);

    //El objeto que va dentro del token 
    const payload = {
        token_type: "access",
        user_id: user._id,
        iat: Date.now(),//Creacion del token 
        exp: expToken.getTime(),
    }
    //Retornamos para generar el token 
    return jwt.sign(payload, JWT_SECRET_KEY);
};

//Refresca el token 
function createRefreshToken(user){
    const expToken = new Date();
    expToken.getMonth(expToken.getMonth() + 1)

    //El objeto que va dentro del token 
    const payload = {
        token_type: "refresh",
        user_id: user._id,
        iat: Date.now(),//Creacion del token 
        exp: expToken.getTime(),
    }
    //Retornamos para generar el token 
    return jwt.sign(payload, JWT_SECRET_KEY);
};

//Decodifica el token 
function decoded(token){
    return jwt.decode(token, JWT_SECRET_KEY, true);
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    decoded,
};