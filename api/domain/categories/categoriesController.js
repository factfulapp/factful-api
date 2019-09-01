const Category = require('./Category');
const CategoryUpdater = require('./CategoryUpdater');

class CategoryCreationError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'CategoryCreationError';
    this.code = code;
    Object.assign(this, data);
  };

  toJSON() {
    if (this.fields) {
      return { code: this.code, fields: this.fields };
    }
    return { code: this.code };
  };
}

module.exports.index = function (req, res, next) {
  Category.findAll()
    .then((records) => {
      return Promise.all(records.map(r => r.toJSON()));
    })
    .then((records) => {
      return res.json({ ok: true, records });
    })
    .catch(next);
};

module.exports.create = function (req, res, next) {
  const name = req.body.name;

  if (!name) {
    return res.status(422).json({
      ok: false,
      errors: [ new CategoryCreationError('CATEGORY_NAME_NOT_PROVIDED') ]
    });
  }

  Category.create({ name })
    .then(data => data.toJSON())
    .then(data => {
      return res.json({ ok: true, data });
    })
    .catch(next);
};

module.exports.update = function (req, res, next) {
  const id = parseInt(req.params.id, 10);

  Category.findOne({ where: { id } })
    .then(record => CategoryUpdater.updateCategory(record, req.body))
    .then(category => category.toJSON())
    .then(function (data) {
      return res.json({ ok: true, data });
    })
    .catch(function (err) {
      if (err.code === 'CategoryUpdateError') {
        return res.status(422).json({ ok: false, errors: [ err.toJSON() ] });
      }
      return next(err);
    });
};
