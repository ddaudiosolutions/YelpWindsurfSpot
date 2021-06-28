const mongoose = require('mongoose')
//import mongoose from 'mongoose';
const Review = require ('./review')
//const User = require ('./user')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//ESTO NOS SIRVE PARA INTRODUCIR EN MEDIO DE LA URL LA OPCIÓN DE W_200 Y CONVERTIR LAS IMAGENES
// A LA HORA DE VISIONARLAS CON UN WIDTH MAX DE 200

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})

// ImageSchema.virtual('thumShow').get(function(){
//     return this.url.replace('/upload', '/upload/w_600,h_300')
// })

const windspotSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

windspotSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('WindSpot', windspotSchema)

