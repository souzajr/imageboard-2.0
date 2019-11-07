'use strict'

module.exports = middleware => {
    return (req, res, next) => {
        if(req.session.user.admin) {
            middleware(req, res, next)
        } else {
            req.session.reset()
            req.logout()
            res.status(401).render('index', {
                page: 'Login',
                message: JSON.stringify('Por favor, faça login para continuar')
            })
        }
    }
}