'use strict';

const csrf = require('csurf');

module.exports = app => {
  /* ============================== */
  /* ============ VIEWS =========== */
  /* ============================== */

  /* ============= HOME ============= */
  app.get('/', app.src.api.board.index);

  app.post('/post', app.src.api.post.store);

  // #region HANDLE ERROR
  app.use(function(err, req, res, next) {
    if (err.code === 'EBADCSRFTOKEN') return res.status(403).json('Forbidden');
    res.status(500).json('Something went wrong');
  });

  app.get('*', function(req, res) {
    res.status(404).render('404');
  });
  // #endregion
};
