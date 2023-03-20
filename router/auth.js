const express = require("express");
const AuthController =  require("../controllers/auth");

const api = express.Router();


//Se escoge el tipo de END POINT a crear, post, put, update, delete, get
api.post("/auth/register", AuthController.register);


//END POINT  para verificar el usaurio que va iniciar sesion 
api.post("/auth/login", AuthController.login);

//END POINT para verificar si un usuario existe
api.post("/auth/refresh_access_token", AuthController.refreshAccessToken);

module.exports = api;