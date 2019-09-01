const Background = require('./Background');
const BackgroundCreator = require('./BackgroundCreator');
const BackgroundUpdater = require('./BackgroundUpdater');

module.exports.index = function (req, res, next) {
  Background.findAll()
    .then((records) => {
      return Promise.all(records.map(r => r.toJSON()));
    })
    .then((records) => {
      return res.json({ ok: true, records });
    })
    .catch(next);
};

module.exports.upload = function (req, res, next) {
  return new BackgroundCreator()
    .perform({ file: req.file })
    .then(background => background.toJSON())
    .then(function (background) {
      return res.status(201).json({ ok: true, background });
    })
    .catch(function (err) {
      if (err.name === 'BackgroundCreationError') {
        return res.status(422).json({ ok: false, errors: [ err.toJSON() ] });
      }
      return next(err);
    });
};

module.exports.update = function (req, res, next) {
  const id = parseInt(req.params.id, 10);

  Background.findOne({ where: { id } })
    .then(record => BackgroundUpdater.updateBackground(record, req.body))
    .then(background => background.toJSON())
    .then(function (data) {
      return res.json({ ok: true, data });
    })
    .catch(function (err) {
      if (err.code === 'BackgroundUpdateError') {
        return res.status(422).json({ ok: false, errors: [ err.toJSON() ] });
      }
      return next(err);
    });
};
