const idLoggedIn = (req, res, next) => {
    console.log('the user', req.user);
    
    if(!req.isAuthenticated()){
        console.log(req.path, req.originalUrl)
        req.flash('errors', 'Debes Iniciar Sesión o Registrarte!!')
        return res.redirect('/login')
    }
    next();
}

export default idLoggedIn;