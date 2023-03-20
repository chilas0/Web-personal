//Aqui se generan las consultas a la DB 
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const image = require("../utils/image")

//Esta funcion devuelve los datos del usuario que esta logueado, recibe los datos del token 
async function getMe(req, res){
    //Recibe los datos del usuario
    const { user_id } = req.user;
    const response = await User.findById(user_id);

    if(!response){
        res.status(400).send({msg: "No se ha encontrado usuario"})
    }else{
        res.status(200).send(response)
    }
}

async function getUsers(req, res){
    const { active } = req.query;
    let response = null;
    if(active === undefined){
        response = await User.find();
    }else{
        response = await User.find({ active});
    }
        res.status(200).send(response);
}


async function createUser(req, res){

    const { password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hasPassword = bcrypt.hashSync(password,salt)
    const user = new User({ ...req.body, active: false, password: hasPassword})

    //Se obtiene el avatar
    //console.log(req.files.avatar);

    //Procesado de la imagen 
    if(req.files.avatar){
        const imagePath = image.getFilePath(req.files.avatar)
        user.avatar = imagePath
    }

    user.save((error, userStored) => {
        if(error){
            res.status(400).send({msg: "Error al crear usuario"})
        }else{
            res.status(201).send(userStored)
        }
    })
}

async function updateUser(req, res){
    const { id } = req.params;
    const userData = req.body;

    //Password
    if(userData.password){
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(userData.password, salt)
        userData.password = hashPassword;
    }else{
        delete userData.password;
    }

    //Avatar
    if(req.files.avatar){
        const imagePath = image.getFilePath(req.files.avatar)
        userData.avatar = imagePath;
    }

    User.findByIdAndUpdate({_id: id},userData, (error) => {
        if(error){
            res.status(400).send({ msg: "Error al actualizar el usuario"})
        }else{
            res.status(200).send({ msg: "Actualizacion correcta"})
        }
    })
}

async function deleteUser(req, res){
    const { id } = req.params;
    User.findByIdAndDelete(id, (error) => {
        if(error){
            res.status(400).send({ msg: "Error al eliminar el usuario"})
        }else{
            res.status(200).send({ msg: "Usuario eliminado"})
        }
    })
}

module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};