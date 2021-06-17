import express from 'express';
const router = express.Router();
import catchAsync from '../utils/catchAsync.js'

import {User} from '../models/user.js';
import passport from 'passport';

import {paginaRegistro, 
    crearRegistro, 
    paginamostrarLogin, 
    paginaGuardarLogin, 
    paginaLogOut} from '../controllers/userController.js'
//RUTAS DE REGISTRO

router.get ('/register', paginaRegistro)

router.post('/register', catchAsync (crearRegistro))

//RUTAS PARA LOGEARSE

router.get('/login', paginamostrarLogin)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), paginaGuardarLogin)

//RUTAS PARA SALIR DE LOGIN

router.get('/logout', paginaLogOut)
export default router;