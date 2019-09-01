const db = require('../../services/db');
const Category = require('../categories/Category');
const Background = require('../backgrounds/Background');

const Fact = db.define('fact', {
  text: {
    type: db.Sequelize.TEXT,
    allowNull: false
  },
  categoryId: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  backgroundId: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  }
});

Fact.prototype.returnCategory = function () {
  return new Promise((resolve, reject) => {
    return this.getCategory()
      .then(category => category.toJSON())
      .then(json => resolve(json))
      .catch(reject);
  });
};

Fact.prototype.returnBackground = function () {
  return new Promise((resolve, reject) => {
    return this.getBackground()
      .then(background => background.toJSON())
      .then(json => resolve(json))
      .catch(reject);
  });
};

Fact.prototype.toJSON = function () {
  return (async () => {
    const {
      id,
      createdAt,
      updatedAt,
      text
    } = this.get();

    const category = await this.returnCategory();
    const background = await this.returnBackground();

    return {
      id,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString(),
      text,
      category,
      background
    };
  })();
};

Fact.belongsTo(Category);
Fact.belongsTo(Background);
Category.hasMany(Fact);
Background.hasMany(Fact);

module.exports = Fact;
