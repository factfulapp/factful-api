const homeController = require('../domain/home/homeController');
const sessionsController = require('../domain/sessions/sessionsController');
const factsController = require('../domain/facts/factsController');
const categoriesController = require('../domain/categories/categoriesController');
const backgroundsController = require('../domain/backgrounds/backgroundsController');
const errorHandler = require('./errorHandler');
const multer = require('multer');

const upload = multer({ dest: 'tmp/uploads/' });

function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    if (req.accepts('html')) {
      return res.redirect('/dashboard/login');
    }
    return res.status(403).json({ ok: false });
  }
  return next();
}

function ensureAnonymous(req, res, next) {
  if (req.user) {
    if (req.accepts('html')) {
      return res.redirect('/dashboard/home');
    }
    return res.status(403).json({ ok: false });
  }
  return next();
}

module.exports = function (app) {
  app.get('/', homeController.index);

  app.post('/login', ensureAnonymous, sessionsController.create);
  app.post('/logout', ensureAuthenticated, sessionsController.destroy);

  app.get('/api/facts', factsController.index);
  app.post('/api/facts', ensureAuthenticated, factsController.create);
  app.patch('/api/facts/:id', ensureAuthenticated, factsController.update);
  app.delete('/api/facts/:id', ensureAuthenticated, factsController.destroy);

  app.get('/api/categories', categoriesController.index);
  app.post('/api/categories', ensureAuthenticated, categoriesController.create);
  app.patch('/api/categories/:id', ensureAuthenticated, categoriesController.update);

  app.get('/api/backgrounds', backgroundsController.index);
  app.post('/api/backgrounds', ensureAuthenticated, upload.single('file'), backgroundsController.upload);
  app.patch('/api/backgrounds/:id', ensureAuthenticated, backgroundsController.update);

  app.get('*', homeController.index);

  app.use(errorHandler);
};
