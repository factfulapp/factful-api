const _ = require('lodash');
const Fact = require('./Fact');

class FactUpdateError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'FactUpdateError';
    this.code = code;
    Object.assign(this, data);
  }

  toJSON() {
    if (this.fields) {
      return { code: this.code, fields: this.fields };
    }
    return { code: this.code };
  }
}

module.exports.updateFact = function (fact, body) {
  return new Promise(function (resolve, reject) {
    const allowedAttributes = [
      'text',
      'categoryId',
      'backgroundId'
    ];
    const attributeKeys = Object.keys(body);
    const forbiddenAttributes = _.difference(attributeKeys, allowedAttributes);

    if (forbiddenAttributes.length > 0) {
      return reject(new FactUpdateError('BAD_ATTRIBUTES', {
        fields: forbiddenAttributes
      }));
    }

    _.assign(fact, body);

    return Fact.findOne({ where: { id: fact.id } })
      .then(record => fact.save())
      .then(function () {
        resolve(fact);
      })
      .catch(reject);
  });
};
