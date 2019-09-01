const db = require('../../services/db');

const Background = db.define('background', {
  name: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  url: {
    type: db.Sequelize.STRING,
    allowNull: false
  }
});

Background.prototype.toJSON = function () {
  return (async () => {
    const {
      id,
      createdAt,
      updatedAt,
      name,
      url
    } = this.get();

    return {
      id,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString(),
      name,
      url
    };
  })();
};

module.exports = Background;
