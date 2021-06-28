const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/userController');

//import express from 'express';
//const router = express.Router();


//import catchAsync from '../utils/catchAsync.js'

//import {User} from '../models/user.js';
//import passport from 'passport';

/*const {paginaRegistro, 
        crearRegistro, 
        paginamostrarLogin, 
        paginaGuardarLogin, 
        paginaLogOut} = require ( '../controllers/userController.js')*/
//RUTAS DE REGISTRO

router.route ('/register')
        .get(users.paginaRegistro)
        .post(users.crearRegistro)

//router.post('/register',  crearRegistro)

//RUTAS PARA LOGEARSE
router.route('/login')
        .get(users.paginamostrarLogin)
        .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.paginaGuardarLogin)

//RUTAS PARA SALIR DE LOGIN

router.get('/logout', users.paginaLogOut)
module.exports = router;