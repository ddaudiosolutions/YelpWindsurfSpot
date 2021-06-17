import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';

import ExpressError from './utils/ExpressError.js';
import session from 'express-session'; //IMPORTAMOS EL NPM DE EXPRESS-SESSION
import flash from 'connect-flash'; // PARA REALIZAR LOS FLASHES AL TERMINAR UN REQ TIPO, CREAR BORRAR EDITAR....

//IMPORTAR ROUTES
import windspotsRoutes from './routes/windspotsRoutes.js'
import windspotsReviews from './routes/windspotsReviews.js'
import usersRoutes from './routes/usersRoutes.js';

//IMPORTAR ELEMENTOS DE AUTENTICACION
import passport from 'passport';
import LocalStrategy from 'passport-local'
import {User} from './models/user.js'

//CONECTAR MONGO
mongoose.connect('mongodb://localhost:27017/windsurf-camp', {
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

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true})) //PARA PODER HACER CORRECTAMENTE POST PUT Y TOMAR LOS DATOS POR REQ.BODY
app.use(methodOverride('_method'));

app.use(express.static('public'))

///1o CONFIGURAMOS LA SESION
//2o CONFIGURAMOS FLASH, SINO NO FUNCIONA. Y SIEMPRE ANTES DE LAS ROUTES.

//CREAMOS LA CONFIGURACION DE SESION
const sessionConfig = {
    secret: 'thesecret',
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

//ESCUCHANDO EL PUERTO
app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})
