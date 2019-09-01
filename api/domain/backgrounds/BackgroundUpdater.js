const _ = require('lodash');
const Background = require('./Background');

class BackgroundUpdateError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'BackgroundUpdateError';
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

module.exports.updateBackground = function (background, body) {
  return new Promise(function (resolve, reject) {
    const allowedAttributes = [ 'name' ];
    const attributeKeys = Object.keys(body);

    const forbiddenAttributes = _.difference(attributeKeys, allowedAttributes);

    if (forbiddenAttributes.length > 0) {
      return reject(new BackgroundUpdateError('BAD_ATTRIBUTES', {
        fields: forbiddenAttributes
      }));
    }

    _.assign(background, body);

    return Background.findOne({ where: { id: background.id } })
      .then(record => background.save())
      .then(function () {
        resolve(background);
      })
      .catch(reject);
  });
};
