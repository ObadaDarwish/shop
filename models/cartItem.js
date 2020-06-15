const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: Sequelize.INTEGER
});


module.exports = CartItem;
