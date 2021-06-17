import express from 'express';
const router = express.Router({mergeParams: true})
import {WindSpot} from '../models/windsurfground.js'; 
import catchAsync from '../utils/catchAsync.js';
import validateWindspot from '../utils/validateWindspot.js';
//import isAuthor from '../utils/isAuthor.js'
import isLoggedIn from '../utils/idLoggedInMw.js';


// IMPORTAR CONTROLERS
import {index, 
    newWindspotForm, 
    guardarNewWindspot,
    mostrarWindspot,
    editarWindspot,
    borrarWindspot} from '../controllers/windspotsController.js'

    
// const isAuthor = async(req, res, nex)=> {
//     const {id} = req.params;
//     const windspot = await WindSpot.findById(id);
//     if(!windspot.author.equals(req.user._id)){
//         req.flash('error', 'You do not have permission to do that!!!');
//     return res.redirect(`/windspots/${id}`)
//     }
//     next()
// }


router.get('/', index)

router.get('/new', isLoggedIn, newWindspotForm )

router.post('/', isLoggedIn, validateWindspot, catchAsync (guardarNewWindspot));

router.get('/:id',  catchAsync (mostrarWindspot));

router.get('/edit/:id', isLoggedIn,  async (req, res) => {
    const windspot = await WindSpot.findById(req.params.id)

    res.render('windspots/edit', {windspot})
}) 

router.put('/:id', isLoggedIn, validateWindspot, catchAsync(editarWindspot));

router.delete('/:id', borrarWindspot )



export default router;