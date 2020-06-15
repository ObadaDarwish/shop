// // const Sequelize = require('sequelize');
// // const sequelize = require('../utils/db');
//
// const mongoDB = require('../utils/db').db;
// const MongoDB = require('mongodb');
// // const User = sequelize.define('user', {
// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         notNull: true,
// //         primaryKey: true,
// //         unique: true
// //     },
// //     name: {
// //         type: Sequelize.STRING,
// //         notNull: true
// //     },
// //     email: {
// //         type: Sequelize.STRING,
// //         notNull: true,
// //         unique: true
// //     }
// // });
//
// class User {
//     constructor(name, email) {
//         this.name = name;
//         this.email = email;
//     }
//
//     addUser() {
//         const db = mongoDB();
//         return db.collection('users').insertOne(this);
//     }
//
//     static addToCart(user, product) {
//         const db = mongoDB();
//         const updateUserCart = (prodIndex) => {
//             let oldCartItems = [...user.cart];
//             let newCart = [];
//             let newQuantity = 1;
//             let prodQuantity = product.quantity;
//             if (typeof prodIndex !== 'undefined') {
//                 newCart = [...oldCartItems];
//                 newQuantity = newCart[prodIndex].quantity + 1;
//                 if (newQuantity <= prodQuantity) {
//                     newCart[prodIndex].quantity = newQuantity;
//                 } else {
//                     throw 'product is out of stock';
//                 }
//             } else {
//                 newCart = [...oldCartItems, {_id: product._id, quantity: newQuantity}];
//             }
//             return db.collection('users').updateOne({_id: new MongoDB.ObjectId(user._id)}, {
//                 $set: {cart: newCart}
//             })
//         };
//         let isProdFound = user.cart && user.cart.findIndex(cartItem => cartItem._id.toString() === product._id.toString());
//         if (isProdFound === -1) {
//             return updateUserCart()
//         } else {
//             return updateUserCart(isProdFound);
//         }
//
//     }
//
//     static removeFromCart(userId, newCart) {
//         const db = mongoDB();
//         return db.collection('users').updateOne({_id: new MongoDB.ObjectId(userId)}, {
//             $set: {cart: newCart}
//         })
//     }
//
//     static getUsers() {
//         const db = mongoDB();
//         return db.collection('users').find().toArray();
//     }
//
//     static getUser(userId) {
//         const db = mongoDB();
//         return db.collection('users').findOne({_id: new MongoDB.ObjectId(userId)});
//     }
//
//
//     static createOrder(userId, products) {
//         const db = mongoDB();
//         return db.collection('orders').insertOne({userId: userId, items: products})
//     }
//
//     static getOrders(userId) {
//         const db = mongoDB();
//         return db.collection('orders').find({userId: userId}).toArray();
//     }
// }
//
// module.exports = User;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: [
        {
            prodId: {type: Schema.Types.ObjectId, required: true, ref: 'Product'},
            quantity: {type: Number, required: true}
        }]
});


userSchema.methods.addToCart = function (product) {
    let isProdFound = this.cart && this.cart.findIndex(cartItem => cartItem.prodId.toString() === product._id.toString());
    let newQuantity = 1;
    const updatedCartItems = [...this.cart];
    if (isProdFound >= 0) {
        newQuantity = this.cart[isProdFound].quantity + 1;
        if (newQuantity <= product.quantity) {
            updatedCartItems[isProdFound].quantity = newQuantity;
        } else {
            throw 'product is out of stock';
        }
    } else {
        updatedCartItems.push({
            prodId: product._id,
            quantity: newQuantity
        })
    }
    this.cart = updatedCartItems;
    return this.save();
};
userSchema.methods.removeFromCart = function (prodId) {
    const updatedCart = [...this.cart].filter(item => item._id.toString() !== prodId.toString());
    this.cart = updatedCart;
    return this.save();
    // return db.collection('users').updateOne({_id: new MongoDB.ObjectId(userId)}, {
    //     $set: {cart: newCart}
    // })
};
userSchema.methods.clearCart = function () {
    this.cart = [];
    return this.save();
};
module.exports = mongoose.model('User', userSchema);
