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

//DEBEMOS USAR ESTA OPTS PARA QUE LOS ELEMENTOS VIRTUALES DE MONGO PUEDAN USARSE DEL LADO DEL CLIENTE.
const opts ={ toJSON: {virtuals: true}};

// ImageSchema.virtual('thumShow').get(function(){
//     return this.url.replace('/upload', '/upload/w_600,h_300')
// })

const windspotSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: { //ESTA ES LA INFORMACIÓN PARA METER EN LA BASE DE MONGO LOS DATOS DEL MAPA
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
   
    
},  opts);

//CREAMOS UNA MAQUINA VIRTUAL PARA PODER INCLUIR LAS PROPIEDADES DE LOS SPOST DE MONGO AL MAPA
windspotSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/windspots/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
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

