// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('node_schema', 'root', 'admin', {
//     dialect: 'mysql'
// });
//
//
// module.exports = sequelize;

// const mongodb = require('mongodb');
// const mongoClient = mongodb.MongoClient;
// let _db;
// const uri = "mongodb+srv://ODarwish:7jU3TqTKMZFF9TGa@cluster0-isb7p.mongodb.net/shop?retryWrites=true&w=majority";
//
// const mongoClientConnection = (cb) => {
//     mongoClient.connect(uri).then(connection => {
//         _db = connection.db();
//         cb()
//     }).catch(err => console.log(err));
// };
// const getDB = () => {
//     if (_db) {
//         return _db
//     }
//     throw 'No DB found!';
// };
//
// exports.mongoConnection = mongoClientConnection;
// exports.db = getDB;

const config = require('../config');
const mongoose = require('mongoose');
const uri = `mongodb+srv://${config.DB_USER}:${config.DB_PASS}@cluster0-isb7p.mongodb.net/shop?retryWrites=true&w=majority`;
const mongoConnection = () => {
    return mongoose.connect(uri);
};
module.exports = mongoConnection;
