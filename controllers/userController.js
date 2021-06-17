import express from 'express';
const router = express.Router();
import catchAsync from '../utils/catchAsync.js'

import {User} from '../models/user.js';
import passport from 'passport';

const paginaRegistro = (req, res)=> {
    res.render('users/register');
}

const crearRegistro = async (req, res, next)=>{
    //HACIENDO EL TRY CATCH CONSIGO QUE EL MENSAJE APAREZCA EN LA MISMA PAGINA
     try {
     const {email, username, password} = req.body //destructuramos para llamar a los datos
     const user = new User({email, username})
     const registeredUser = await User.register(user, password)
 
     //USAMOS UNA FUNCION DE PASSPORT PARA CONSEGUIR QUE AL REGISTRARSE VAYA DIRECTO A LA PAGINA
     //ESTANDO YA LOGEADO.
     req.login(registeredUser, err => {
         if(err) return next (err);
         req.flash ('success', 'Bienvenido a WindSpots')
         res.redirect('/windspots')
     })
 
     
 } catch (e) {
     req.flash ('errors', e.message)
     res.redirect('register')
 }
     //console.log(registeredUser)
     
 }


 const paginamostrarLogin = (req, res)=>{
    res.render('users/login' )
}

const paginaGuardarLogin = (req, res)=>{
    req.flash('success', 'Bienvenido De Vuelta')
    res.redirect('/windspots')
}

const paginaLogOut = (req, res)=>{
    req.logout()
    req.flash('success', 'GOODBYE')
    res.redirect('/')
}

export { paginaRegistro,
    crearRegistro,
    paginamostrarLogin,
    paginaGuardarLogin,
    paginaLogOut}