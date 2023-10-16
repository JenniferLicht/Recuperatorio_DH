module.exports = {
    logged: function (req, res, next) {
        if (req.session.usuarioLogeado) {
            next()
        } else {return res.redirect('/')}
    },
    adminAcces: function (req, res, next) {
        if ((req.session.usuarioLogeado && req.session.usuarioLogeado.esAdmin)) {
            next()
        } else {return res.redirect('/user/profile')}
    },
}