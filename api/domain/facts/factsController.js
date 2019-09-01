const Fact = require('./Fact');
const FactUpdater = require('./FactUpdater');

class FactCreationError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'FactCreationError';
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
  Fact.findAll()
    .then((records) => {
      return Promise.all(records.map(r => r.toJSON()));
    })
    .then((records) => {
      return res.json({ ok: true, records });
    })
    .catch(next);
};

module.exports.create = function (req, res, next) {
  const { text, categoryId, backgroundId } = req.body;

  if (!text) {
    return res.status(422).json({
      ok: false,
      errors: [ new FactCreationError('MISSING_FACT_TEXT') ]
    });
  }

  if (!categoryId) {
    return res.status(422).json({
      ok: false,
      errors: [ new FactCreationError('MISSING_FACT_CATEGORY') ]
    });
  }

  if (!backgroundId) {
    return res.status(422).json({
      ok: false,
      errors: [ new FactCreationError('MISSING_FACT_BACKGROUND') ]
    });
  }

  Fact.create({
    text,
    categoryId,
    backgroundId
  })
    .then(data => data.toJSON())
    .then(data => {
      return res.json({ ok: true, data });
    })
    .catch(next);
};

module.exports.update = function (req, res, next) {
  const id = parseInt(req.params.id, 10);

  Fact.findOne({ where: { id } })
    .then(record => FactUpdater.updateFact(record, req.body))
    .then(fact => fact.toJSON())
    .then(function (data) {
      return res.json({ ok: true, data });
    })
    .catch(function (err) {
      if (err.code === 'FactUpdateError') {
        return res.status(422).json({ ok: false, errors: [ err.toJSON() ] });
      }
      return next(err);
    });
};

module.exports.destroy = function (req, res, next) {
  const id = parseInt(req.params.id, 10);

  function handle(fact) {
    return new Promise(function (resolve, reject) {
      return Fact.destroy({ where: { id: fact.id } })
        .then(function () {
          return resolve(fact);
        })
        .catch(reject);
    });
  }

  return Fact.findOne({ where: { id } })
    .then(record => handle(record))
    .then(data => data.toJSON())
    .then(data => {
      return res.json({ ok: true, data });
    })
    .catch(next);
};
