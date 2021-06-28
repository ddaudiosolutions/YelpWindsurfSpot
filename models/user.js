const mongoose = require('mongoose')
//import mongoose from 'mongoose';

const Schema = mongoose.Schema
const  passportLocalMongoose = require( 'passport-local-mongoose');
//DOCUMENTOS SOBRE PASSPORT-LOCAL MONGOOSE EN GITHUB

const UserSchema = new Schema ({
   email: {
       type: String,
       required: true,
       unique: true
   }
   

})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)