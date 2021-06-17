
import Joi from 'joi';
//IMPORTAR MODELOS

import ExpressError from '../utils/ExpressError.js';

const validateReview = (req, res, next)=> {
    const reviewSchema = Joi.object({
            review: Joi.object({
            rating: Joi.number().required().min(0).max(5),
            body: Joi.string().required(),
              
        }).required()
    })
    const {error} = reviewSchema.validate(req.body);
   
    if(error){
        const msg = error.details.map (el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

export default validateReview;