const mongoose = require('mongoose')
//import mongoose from 'mongoose';
const Review = require ('./review')
//const User = require ('./user')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
});

/*ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});*/

const windspotSchema = new Schema({
    title: String,
    images: [{ //CREAMOS UN ARRAY PARA RECOGER LOS DATOS DE LA URL DE LA FOTO Y EL NOMBRE
        url: String,
        filename: String
    }],
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

