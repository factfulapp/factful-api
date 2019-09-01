const _ = require('lodash');
const Category = require('./Category');

class CategoryUpdateError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'CategoryUpdateError';
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

module.exports.updateCategory = function (category, body) {
  return new Promise(function (resolve, reject) {
    const allowedAttributes = [ 'name' ];
    const attributeKeys = Object.keys(body);
    const forbiddenAttributes = _.difference(attributeKeys, allowedAttributes);

    if (forbiddenAttributes.length > 0) {
      return reject(new CategoryUpdateError('BAD_ATTRIBUTES', {
        fields: forbiddenAttributes
      }));
    }

    _.assign(category, body);

    return Category.findOne({ where: { id: category.id } })
      .then(record => category.save())
      .then(function () {
        resolve(category);
      })
      .catch(reject);
  });
};
