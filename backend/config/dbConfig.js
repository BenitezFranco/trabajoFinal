const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('foodbook', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
