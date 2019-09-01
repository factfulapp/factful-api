const db = require('../../services/db');

const Category = db.define('category', {
  name: {
    type: db.Sequelize.STRING,
    allowNull: false
  }
});

Category.prototype.toJSON = function () {
  return (async () => {
    const {
      id,
      createdAt,
      updatedAt,
      name
    } = this.get();

    return {
      id,
      createdAt: createdAt && createdAt.toUTCString(),
      updatedAt: updatedAt && updatedAt.toUTCString(),
      name
    };
  })();
};

module.exports = Category;
