const jwt = require("../utils/jwt");

//El next quiere decir que puede continuar con la opcion siguiente 
function asureAuth(req, res, next){
    //console.log("Hola estoy en asure auth");

    //De esta manera se bloquea el usuario y el meddleware no lo deja pasar 
    //res.status(500).send({msg: "MD bloquea"});

    //Verificar la autenticidad del usuario 
    if(!req.headers.authorization){
        res.status(403).send({msg: "La peticion no tiene la cabecera de autenticacion"})
    }

    //Eliminamos el Bearer del token 
    const token = req.headers.authorization.replace("Bearer ", "")
    try {
        //Decodifica el token 
        const payload = jwt.decoded(token);

        //Fecha de expiracion del token 
        const { exp } = payload;
        //Fecha actual
        const currentData = new Date().getTime();   
        if(exp <= currentData){
            return res.status(400).send({msg: "El token ha expirado"})
        }
        //Se envia el payload a user 
        req.user = payload;
        next();

    } catch (error) {
        return res.status(400).send({msg: "Token invalido"})
    }
}

module.exports = {
    asureAuth,
}