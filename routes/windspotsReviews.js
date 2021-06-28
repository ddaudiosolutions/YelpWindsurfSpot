const express = require('express');
const router = express.Router({ mergeParams: true });
const validateReview  = require('../utils/validateReviews');
//const {  isAuthor } = require('../utils/isAuthor');
const  idLoggedInMw  = require('../utils/idLoggedInMw');



//const WindSpot = require('../models/windsurfground.js');
//const Review = require('../models/review');
//const reviews = require('../controllers/reviewsController');
//const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

/*import express from 'express';
const router = express.Router({mergeParams: true})

import {Review} from '../models/review.js';
import {WindSpot} from '../models/windsurfground.js';
import validateReview from '../utils/validateReviews.js' 
import idLoggedInMw from '../utils/idLoggedInMw.js'
import catchAsync from '../utils/catchAsync.js';
import ExpressError from '../utils/ExpressError.js';*/

const {guardarReview, borrarReview} = require ( '../controllers/reviewsController.js')



//CREAR REVIEWS PARA UN SPOT
router.post('/', idLoggedInMw, validateReview, catchAsync(guardarReview))
//BORRAR REVIEWS DE UN SPOT CONCRETO 

router.delete('/:reviewId', catchAsync(borrarReview ))

module.exports = router