const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        notNull: true
    },
    quantity: Sequelize.INTEGER
});
module.exports = OrderItem;
