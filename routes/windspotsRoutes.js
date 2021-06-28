const express = require ('express')
//import express from 'express';
const router = express.Router({mergeParams: true})

const dotenv = require ('dotenv')
//import dotenv from 'dotenv';
dotenv.config()

const WindSpot = require ('../models/windsurfground.js')
//import {WindSpot} from '../models/windsurfground.js'; 
const catchAsync = require('../utils/catchAsync');
//import catchAsync from '../utils/catchAsync.js';
const validateWindspot = require ('../utils/validateWindspot.js')
//import validateWindspot from '../utils/validateWindspot.js';
const isAuthor = require('../utils/idLoggedInMw')
//import isLoggedIn from '../utils/idLoggedInMw.js';
const isLoggedIn = require ('../utils/idLoggedInMw.js')

const multer = require ('multer')
//import multer from 'multer'; //necesitamos npm multer para modificar el formulario y poder manegar archivos

const {storage } = require ('../cloudinary')
 const upload = multer({storage});

// IMPORTAR CONTROLERS
const windspots = require('../controllers/windspotsController')

router.route('/')
    .get(catchAsync(windspots.index))
    .post(isLoggedIn,  upload.array('image'), validateWindspot, catchAsync(windspots.guardarNewWindspot))
    

router.get('/new', isLoggedIn, windspots.newWindspotForm )


 
router.route('/:id')
    .get(catchAsync (windspots.mostrarWindspot))
    .put(isLoggedIn, isAuthor , upload.array('image'), validateWindspot, catchAsync(windspots.editarWindspot))
    .delete(catchAsync(windspots.borrarWindspot) )


router.get('/edit/:id', isLoggedIn,  catchAsync(windspots.mostrarEdicionWindspot)) 



module.exports = router;