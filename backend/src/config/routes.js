'use strict'

const csrf = require('csurf')

module.exports = app => {

  /* ============================== */
  /* ============ VIEWS =========== */
  /* ============================== */

    /* ============= HOME ============= */
    app.route('/')
      .get(csrf(), app.src.api.homePage.viewHome)

  //#region HANDLE ERROR
  app.use(function (err, req, res, next) {
    if (err.code === 'EBADCSRFTOKEN')
      return res.status(403).json('Forbidden')
    res.status(500).render('500')
  })

  app.get('*', function (req, res) {
    res.status(404).render('404')
  })
  //#endregion
}
