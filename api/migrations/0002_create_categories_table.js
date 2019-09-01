module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: function (q, Sequelize) {
    return q.dropTable('categories');
  }
};
