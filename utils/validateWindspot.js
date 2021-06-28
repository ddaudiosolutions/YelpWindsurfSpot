
//import Joi from 'joi';
//IMPORTAR MODELOS
const Joi = require ('joi')
const ExpressError = require ('../utils/ExpressError.js')
//import ExpressError from '../utils/ExpressError.js';

const validateWindspot = (req, res, next)=> {
    const windspotSchema = Joi.object({
            windspot: Joi.object({
            title: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),
            //image: Joi.string().required()
        }).required(),
        deleteImages: Joi.array()
    })
    const {error} = windspotSchema.validate(req.body);
   
    if(error){
        const msg = error.details.map (el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports = validateWindspot;