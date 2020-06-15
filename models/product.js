// const Sequelize = require('sequelize');
// const sequelize = require('../utils/db');
// const mongoDB = require('../utils/db').db;
// const mongodb = require('mongodb');
//
// class Product {
//     constructor(name, description, price, quantity, userId) {
//         this.name = name;
//         this.description = description;
//         this.price = price;
//         this.quantity = quantity;
//         this.userId = userId
//     }
//
//
//     save() {
//         const db = mongoDB();
//         return db.collection('products').insertOne(this);
//     }
//
//     static getAllProducts() {
//         const db = mongoDB();
//         return db.collection('products').find().toArray()
//     }
//
//     static getProducts(cartProducts) {
//         const db = mongoDB();
//
//         let modifiedArray = cartProducts.map(product => {
//             return new mongodb.ObjectId(product._id)
//         });
//         return db.collection('products').find({
//             _id: {
//                 $in: modifiedArray
//             }
//         }).toArray().then(products => {
//             return products.map(product => {
//                 return {...product, quantity: cartProducts.find(p => p._id.toString() === product._id.toString()).quantity}
//             })
//         })
//     }
//
//     static getProduct(prodID) {
//         const db = mongoDB();
//         return db.collection('products').find({_id: new mongodb.ObjectId(prodID)}).next()
//     }
//
//     static updateProduct(prodID, newUpdates) {
//         const db = mongoDB();
//         return db.collection('products').updateOne({_id: new mongodb.ObjectId(prodID)}, {$set: newUpdates})
//     }
//
//     static deleteProduct(prodID) {
//         const db = mongoDB();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodID)})
//     }
// }

// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         unique: true,
//         primaryKey: true
//     },
//     name: Sequelize.STRING,
//     description: Sequelize.STRING,
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     quantity: Sequelize.INTEGER
// });


// module.exports = Product;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
