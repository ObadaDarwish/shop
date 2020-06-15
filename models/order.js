// const Sequelize = require('sequelize');
// const sequelize = require('../utils/db');
//
// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         unique: true,
//         autoIncrement: true,
//         notNull: true
//     }
// });
// module.exports = Order;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: {
        type: [Object]
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);
