
const Review = require ('../models/review.js')
//import {Review} from '../models/review.js';
//import {WindSpot} from '../models/windsurfground.js';
const WindSpot = require ('../models/windsurfground.js')

module.exports.guardarReview = async(req, res) => {
    const windspot = await WindSpot.findById(req.params.id) //identificamos el spot
    //console.log(windspot)
    const review = new Review(req.body.review) //realizamos el cuestionario    
    review.author = req.user._id;
    windspot.reviews.push(review); //añadimos al windspot el cuestionario en el array creado en el modelo windsurfground.js
    await review.save(); //SALVAMOS EL REVIEW
    await windspot.save(); //SALVAMOS EL SPOT PARA GUARDAR EL REVIEW
    req.flash('success', 'Nueva Reseña Creada') //CREAMOS UN FLASH PARA COMUNICAR QUE SE HA CREADO 
    res.redirect(`/windspots/${windspot._id}`) 
}

module.exports.borrarReview = async (req, res) =>{
    //res.send('BORRANDO REVIEW')
    //const windspot = await WindSpot.findById(req.params.id)
    const {reviewId, id} = req.params; //RECUPERAMOS LOS ID DEL SPOT I DEL REVIEW
    await WindSpot.findByIdAndUpdate (id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Reseña Eliminada!!') //CREAMOS UN FLASH PARA COMUNICAR QUE SE HA CREADO 
    res.redirect(`/windspots/${id}`) //REDIRIGIMOS A LA MISMA PAGINA

}

//module.exports = { guardarReview, borrarReview}