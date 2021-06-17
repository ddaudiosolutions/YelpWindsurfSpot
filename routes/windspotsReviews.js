import express from 'express';
const router = express.Router({mergeParams: true})

import {Review} from '../models/review.js';
import {WindSpot} from '../models/windsurfground.js';
import validateReview from '../utils/validateReviews.js' 
import catchAsync from '../utils/catchAsync.js';
import ExpressError from '../utils/ExpressError.js';

import {guardarReview, borrarReview} from '../controllers/reviewsController.js'



//CREAR REVIEWS PARA UN SPOT
router.post('/', validateReview, catchAsync(guardarReview))
//BORRAR REVIEWS DE UN SPOT CONCRETO 

router.delete('/:reviewId', catchAsync(borrarReview ))

export default router