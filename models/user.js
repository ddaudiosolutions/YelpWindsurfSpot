import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';
//DOCUMENTOS SOBRE PASSPORT-LOCAL MONGOOSE EN GITHUB

const UserSchema = new Schema ({
   email: {
       type: String,
       required: true,
       unique: true
   },
   

})

UserSchema.plugin(passportLocalMongoose);

export const User = mongoose.model('User', UserSchema)