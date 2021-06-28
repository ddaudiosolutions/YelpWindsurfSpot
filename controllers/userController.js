//import express from 'express';
const express = require ('express');
const router = express.Router();
//import catchAsync from '../utils/catchAsync.js'
const User = require('../models/user.js')
//import {User} from '../models/user.js';
//import passport from 'passport';

const passport = require ('passport')

module.exports.paginaRegistro = (req, res)=> {
    res.render('users/register');
}

module.exports.crearRegistro = async (req, res, next)=>{
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


 module.exports.paginamostrarLogin = (req, res)=>{
    res.render('users/login' )
}

module.exports.paginaGuardarLogin = (req, res)=>{
    req.flash('success', 'Bienvenido De Vuelta')
    res.redirect('/windspots')
}

module.exports.paginaLogOut = (req, res)=>{
    req.logout()
    req.flash('success', 'GOODBYE')
    res.redirect('/')
}

