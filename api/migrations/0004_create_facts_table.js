module.exports = {
  up: function (q, Sequelize) {
    return q.createTable('facts', {
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
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      backgroundId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  down: function (q, Sequelize) {
    return q.dropTable('facts');
  }
};
