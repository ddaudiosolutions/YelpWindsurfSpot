import mongoose from 'mongoose';
import { Review } from './review.js';
const {Schema} = mongoose;


const windspotSchema = new Schema({
    title: String,
    image: String,
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

export const WindSpot = mongoose.model('WindSpot', windspotSchema)

