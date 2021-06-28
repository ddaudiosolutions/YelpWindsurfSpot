//import ExpressError from '../utils/ExpressError.js';
const WindSpot = require ('../models/windsurfground')
const ExpressError = require ('../utils/ExpressError.js')

const isAuthor = async(req, res, nex)=> {
    const {id} = req.params;
    const windspot = await WindSpot.findById(id);
    if(!windspot.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!!!');
    return res.redirect(`/windspots/${id}`)
    }
    next()
}

module.exports = isAuthor;