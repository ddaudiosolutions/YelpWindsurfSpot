if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//console.log(process.env.CLOUDINARY_CLOUD_NAME)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError.js');
const methodOverride = require('method-override');



const session = require('express-session');
const flash = require('connect-flash');
/*import session from 'express-session'; //IMPORTAMOS EL NPM DE EXPRESS-SESSION
import flash from 'connect-flash'; */// PARA REALIZAR LOS FLASHES AL TERMINAR UN REQ TIPO, CREAR BORRAR EDITAR....



//IMPORTAR ELEMENTOS DE AUTENTICACION
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
/*import passport from 'passport';
import LocalStrategy from 'passport-local'
import {User} from './models/user.js'*/

//IMPORTAR ROUTES
const usersRoutes = require('./routes/usersRoutes.js');
const windspotsRoutes = require('./routes/windspotsRoutes.js');
const windspotsReviews = require('./routes/windspotsReviews.js');
/*import windspotsRoutes from './routes/windspotsRoutes.js'
import windspotsReviews from './routes/windspotsReviews.js'
import usersRoutes from './routes/usersRoutes.js';*/

//EVITAR MONGO INJECTION
const mongoSanitize = require('express-mongo-sanitize');

//PARA CONECTAR CON MONGODB ATLAS
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/windsurf-camp'
//'mongodb://localhost:27017/windsurf-camp'

//CONECTAR CON MONGO-CONNECT PARA TENER BD EN LOCAL Y PRODUCCION
const MongoDBStore = require('connect-mongo')(session);

//CONECTAR MONGO
mongoose.connect(dbUrl,  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Database connected")
})

const app = express();



app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true})) //PARA PODER HACER CORRECTAMENTE POST PUT Y TOMAR LOS DATOS POR REQ.BODY
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

app.use(mongoSanitize());
///1o CONFIGURAMOS LA SESION
//2o CONFIGURAMOS FLASH, SINO NO FUNCIONA. Y SIEMPRE ANTES DE LAS ROUTES.

//CREAMOS LA VARIABLE SECRET(EN EL PROCESO DE DEPLOYMENT), PARA QUE USE LA LOCAL O LA DE ATLAS
const secret = process.env.SECRET || 'thesecret'


//CREAMOS UNA NUEVA MONGO-CONNECT DBSTORE PARA CONECTAR LA SESION CON LA BASE DE DATOS (ESTE PASO ES EN EL DEPLOYMENT)
const store = new MongoDBStore ({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60

});

store.on ('error', function (e) {
    console.log('SESSION STORE ERROR', e)
    
});
//CREAMOS LA CONFIGURACION DE SESION
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //para evitar accesos indeseados desde el lado del cliente 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig)); //LLAMAMOS A EXPRESS-SESSION

//USAMOS FLASH
app.use(flash());
//TODO LO QUE VENGA DE PASSPORT. DEBE IR ANTES DE LAS VARIABLES LOCALES PARA QUE FUNCIONE
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//APLICAMOS APP.USE A PASSPORT SIEMPRE DESPUES DE EXPRESS-SESSION PARA QUE FUNCIONE
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))//VIENE DE LA APP PASSPORT.

//CREAMOS EL MIDDLEWARE PARA LOS FLASH, SIEMPRE ANTES DE LAS ROUTES.
app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('errors');
    next();

})




 
// app.get ('/fakeUser', async (req, res, next)=> {
//     const user = new User ({email:'ddddd@gmail.com', username: 'dcladera'} )
//     const newUser = await User.register(user, 'raixa')
//     res.send(newUser);
// })

/////////ROUTES VAN AQUÍ ABAJO!!!!!!!!!!
app.use('/', usersRoutes)
app.use('/windspots', windspotsRoutes)
app.use('/windspots/:id/reviews', windspotsReviews)

//TRABAJANDO CON LAS VIEWS Y LA BASE DE DATOS
app.get('/', (req, res) => {
    res.render('home');    
    });

app.all('*', (req, res, next)=> {
    
    next (new ExpressError('Page Not Found', 404))
})
app.use ((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong! Try it Later!!'
    res.status(statusCode).render('error', {err})
})

const port = process.env.PORT || 3000;

//ESCUCHANDO EL PUERTO
app.listen(port, ()=> {
    console.log(`Serving on ${port} `)
})
