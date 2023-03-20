//Exportar el modelo User 
const User = require("../models/user");

//Exportar el paquete de bcrypt para encriptar contraseñas 
const bcrypt = require("bcryptjs");

//Importamos los token 
const jwt = require("../utils/jwt");

/**END POINT POR EXPRESS */

function register(req, res){
    const {fisrtname, lastname, email, password} = req.body;

    //Se valida si el correo viene vacio 
    if(!email) res.status(400).send({msg: "El email es obligatorio."});
    if(!password) res.status(400).send({msg: "La contraseña es obligatoria."});

    //Creamos el objeto usuario
    const user = new User({
        fisrtname,
        lastname,
        email: email.toLowerCase(),
        role: "user",
        active: true,
        password,
    });

    //Encripta la contraseña 
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;

    user.save((error, userStorage) => {
        if(error){
            res.status(400).send({msg: "Error al crear usuario"});
        }else{
            res.status(200).send(userStorage);
        }
    });

    //Se genera esta respuesta para el usuario
    //res.status(200).send({msg: "TODO OK"});
}

//Creacion del login 
function login(req, res){
    const {email, password} = req.body;

    if(!email) res.status(400).send({msg: "El email es obligatorio"});
    if(!password) res.status(400).send({msg: "La contraseña es obligatoria"});

    const emailLowerCase = email.toLowerCase();
    User.findOne({email: emailLowerCase}, (error, userStorage) => {
        if(error){
            res.status(500).send({msg: "Error del servidor"})
        }else{
            //Asi se compara una contraseña encriptada con una sin encriptar gracias al paquete bcrypt
            bcrypt.compare(password, userStorage.password, (bcryptError, check) => {
                if(bcryptError){
                    res.status(500).send({msg: "Error del servidor"});
                    //Verrifica si la contraseña es correcta 
                }else if(!check){
                    res.status(500).send({msg: "Contraseña incorrecta"});
                    //Si el usuario no esta activado entonces arroja el error 
                }else if(!userStorage.active){
                    res.status(401).send({msg: "Usuario no activo"});
                    //Si todo esta bien se crea el inicio de sesion 
                }else{
                    res.status(200).send({
                        access: jwt.createAccessToken(userStorage),
                        refresh: jwt.createRefreshToken(userStorage),
                    });

                }
            });
        }
    });
}
//Fin de login

function refreshAccessToken(req, res){
    //Se obtiene los datos 
    const { token } = req.body;

    if(!token) res.status(400).send({msg: "Token requerido"});

    //Se llama a decoded y se obtiene el user_id
    const { user_id } = jwt.decoded(token);

    //Busca un user en la DB 
    User.findOne({ _id: user_id}, (error, userStorage) => {
        if(error){
            res.status(500).send({msg: "Error del servidor"});
        }else{
            res.status(200).send({
                //Si no existe un error se crea un nuevo accessToken 
                accessToken: jwt.createAccessToken(userStorage),
            });

        }
    })
}

//Estamos expoprtando la funcion 
module.exports = {
    register,
    login,
    refreshAccessToken,
};