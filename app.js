const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
// const sequelize = require('./utils/db');
const adminRoute = require('./routes/admin');
const users = require('./routes/users');
// const User = require('./models/user');
const shop = require('./routes/shop');
const auth = require('./routes/auth');
const app = express();
const path = require('path');
var fs = require('fs');
const multer = require('./middleware/upload');
const isAuth = require('./middleware/is-auth').isAuth;
const helmet = require('helmet');
const morgan = require('morgan');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cartItem');
// const Order = require('./models/order');
// const OrderItem = require('./models/

const config = require('./config');
const mongoClient = require('./utils/db');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer);
app.use(helmet());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined',{ stream: accessLogStream }));
// CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
    next();
});

app.use('/admin', isAuth, adminRoute);
app.use('/user', users);
app.use(auth);
app.use(isAuth, shop);
app.use('/', (req, res, next) => {
    res.send('Server is up and running!');
});
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.use((err, req, res, next) => {
    res.status(err.statusCode).send(err);
});
// app.use((error, req, res, next) => {
//     console.log('error middleware')
//     // res.status(error.statusCode).send(error);
// });
// Product.belongsTo(User);
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsToMany(Product, {through: CartItem});
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product,{through:OrderItem});
//
//
// sequelize
// // .sync({force:true})
//     .sync()
//     .then(res => {
//         app.listen(3000);
//     }).catch(err => {
//     console.log(err);
// });
mongoClient().then((result) => {
    app.listen(process.env.PORT || 8080);
});

