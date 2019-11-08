'use strict';

module.exports = middleware => {
  return (req, res, next) => {
    if (req.session.user) {
      middleware(req, res, next);
    } else {
      req.session.reset();
      req.logout();
      res.status(401).json('Please login to continue');
    }
  };
};
