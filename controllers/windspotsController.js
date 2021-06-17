import {WindSpot} from '../models/windsurfground.js';

const index  = async (req, res) =>{    
    const windspots = await WindSpot.find({})
    res.render('windspots/index', {windspots})
}
const newWindspotForm = (req, res) =>{
    
    res.render('windspots/new')
}

const guardarNewWindspot = async (req, res) => {
    
    const windspot = new WindSpot(req.body.windspot)
    windspot.author = req.user._id;
    await windspot.save();
    req.flash('success', 'Nuevo Windspot Creado') //CREAMOS UN FLASH PARA COMUNICAR QUE SE HA CREADO 
    res.redirect(`/windspots/${windspot._id}`)
}

const mostrarWindspot = async (req, res) =>{   
    const windspot = await (await WindSpot.findById(req.params.id).populate('reviews').populate('author'));//dentro del populate, LLAMAMOS A LA BASE DE DATOS DONDE SE GUARDAN LOS REVIEWS.
   // console.log(windspot.author.username)
    if(!windspot){
        req.flash('errors', 'Windspot No Encontrado!!')
        return res.redirect('/windspots')
    }
    res.render('windspots/show', {windspot})
}

const editarWindspot = async (req, res)=> {
    const {id} = req.params;
    const windspot = await WindSpot.findByIdAndUpdate(id, {...req.body.windspot})
    req.flash('success', 'Windspot Actualizado Correctamente!!!') //CREAMOS UN FLASH PARA COMUNICAR QUE SE HA CREADO 
    res.redirect(`/windspots/${windspot._id}`)
}

const borrarWindspot = async (req, res)=> {
    const {id} = req.params;
    const windspot = await WindSpot.findByIdAndDelete(id, {...req.body.windspot})
    req.flash('success', 'Windspot Eliminado Correctamente!!') //CREAMOS UN FLASH PARA COMUNICAR QUE SE HA CREADO 
    res.redirect('/windspots');
}

export { index,
    newWindspotForm,
    guardarNewWindspot,
    mostrarWindspot,
    editarWindspot,
    borrarWindspot}