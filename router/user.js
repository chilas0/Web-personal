const express = require("express");
const multiparty = require("connect-multiparty")
//const { API_VERSION } = require("../constans");
const UserController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");

const md_upload = multiparty({uploadDir: "./uploads/avatar"})
const api = express.Router();


//El middlewares verifica quien entra a la direccion, sirve para tener end-points protegidos 
api.get("/user/me", [md_auth.asureAuth],UserController.getMe);

//Obtiene los usuarios
api.get("/users", [md_auth.asureAuth], UserController.getUsers)

//Puede tener N middlewares //Crear usuario
api.post("/user",[md_auth.asureAuth, md_upload], UserController.createUser)

//Solo actualiza los datos que enviemos **patch
api.patch("/user/:id", 
[md_auth.asureAuth, md_upload],
 UserController.updateUser)


 //Eliminar usuario
 api.delete("/user/:id", [md_auth.asureAuth], UserController.deleteUser)

module.exports = api