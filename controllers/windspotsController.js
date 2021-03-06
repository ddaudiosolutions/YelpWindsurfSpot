
const WindSpot = require ('../models/windsurfground.js')
const {cloudinary} = require ('../cloudinary');
const mbxGeocoding = require ('@mapbox/mapbox-sdk/services/geocoding')//PARA EL MAPA
const mapBoxToken = process.env.MAPBOX_TOKEN; //creamos la variable del token creado en Mapbox
const geocoder = mbxGeocoding({accessToken: mapBoxToken}) //

module.exports.index  = async (req, res) =>{    
    const windspots = await WindSpot.find({})

    res.render('windspots/index', {windspots})
}

module.exports.newWindspotForm = (req, res) =>{    
    res.render('windspots/new')
}

//CREAR UN NUEVO WINDSPOT
module.exports.guardarNewWindspot = async (req, res, next) => {        
   //creamos la variable para obtener del formulario la localizacion y
   //poder enviarla a la API de mapbox
    const geoData = await geocoder.forwardGeocode({
        query: req.body.windspot.location,
        limit: 1,
    }).send();
    
    const windspot = new WindSpot(req.body.windspot)
    windspot.geometry = geoData.body.features[0].geometry;//guardamos esa info en la base de mongo
    windspot.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    windspot.author = req.user._id;
    await windspot.save();
    //console.log(windspot);
    req.flash('success', 'Nuevo Windspot Creado') //CREAMOS UN FLASH PARA COMUNICAR QUE SE HA CREADO 
    res.redirect(`/windspots/${windspot._id}`)
}

module.exports.mostrarWindspot = async (req, res) =>{   
    const windspot = await ( WindSpot.findById(req.params.id).populate({
            path: 'reviews', 
            populate: {path :'author'}
            }).populate('author'));//dentro del populate, LLAMAMOS A LA BASE DE DATOS DONDE SE GUARDAN LOS REVIEWS.
   // console.log(windspot.author.username)
    if(!windspot){
        req.flash('errors', 'Windspot No Encontrado!!')
        return res.redirect('/windspots')
    }
    res.render('windspots/show', {windspot})
}


module.exports.mostrarEdicionWindspot = async (req, res) => {
    const {id} = req.params;
    const windspot = await WindSpot.findById(id)
    if(!windspot){
        req.flash('error', 'No se puede encontrar el Windspot!');
        return res.redirect('/windspots');
    }
    res.render('windspots/edit', {windspot})
}

//EDITAR UN WINDSPOT
module.exports.editarWindspot = async (req, res)=> {
   
    const geoData = await geocoder.forwardGeocode({
        query: req.body.windspot.location,
        limit: 1,
    }).send();
    
    const {id} = req.params;
    console.log(req.body);
    const windspot = await WindSpot.findByIdAndUpdate(id, {...req.body.windspot})
    windspot.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
     windspot.images.push(...imgs) ;
     await windspot.save();
     //PARA BORRAR LAS FOTOS DE LA PAGINA Y DEL SERVIDOR.
     if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await windspot.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    // windspot.author = req.user._id;
    req.flash('success', 'Windspot Actualizado Correctamente!!!') //CREAMOS UN FLASH PARA COMUNICAR QUE SE HA CREADO 
    res.redirect(`/windspots/${windspot._id}`)
}

module.exports.borrarWindspot = async (req, res)=> {
    const {id} = req.params;
    const windspot = await WindSpot.findByIdAndDelete(id, {...req.body.windspot})
    req.flash('success', 'Windspot Eliminado Correctamente!!') //CREAMOS UN FLASH PARA COMUNICAR QUE SE HA CREADO 
    res.redirect('/windspots');
}

