const rootDir = require('../utils/rootpath');
const path = require('path');
const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const mongoose = require('mongoose');
const fs = require('fs');
const config = require('../config');
const stripe = require('stripe')(config.STRIPE_KEY);

// exports.getShop = (req, res, next) => {
//     res.sendfile(path.join(rootDir, 'views', 'shop.html'))
// };

exports.getCart = (req, res, next) => {
    req.user.populate('cart.prodId')
        .execPopulate().then(products => {
        res.send(products.cart);
    }).catch(err => {
        console.log(err);
    })
    // if (req.user.cart && req.user.cart.length) {
    //     Product.getProducts(req.user.cart).then(products => {
    //         if (products.length) {
    //             res.send(products);
    //         } else {
    //             res.status(404).send({message: 'Cart is empty!'})
    //         }
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // } else {
    //     res.status(404).send({message: 'Cart is empty!'})
    // }
    // req.user.getCart().then(cart => {
    //     return cart.getProducts()
    // }).then(products => {
    //     if (products.length) {
    //         res.send(products);
    //     } else {
    //         res.status(404).send({message: 'Cart is empty!'})
    //     }
    // }).catch(err => {
    //     res.status(405).send(err)
    // })
};


const createCartIfNotFound = (user) => {
    return user.getCart().then(cart => {
        if (cart) {
            return cart;
        } else {
            return user.createCart().then((newCart) => {
                return newCart;
            }).catch(err => {
                res.status(405).send(err)
            })
        }
    }).catch(err => {
        res.status(405).send(err)
    })
};
exports.addToCart = (req, res, next) => {
    Product.findById(req.body.prodId).then(product => {
        return req.user.addToCart(product);
    }).then(() => {
        res.send('product was added successfully');
    }).catch(err => {
        res.status(405).send(err);
    });
};
// exports.addToCart = (req, res, next) => {
//     const prodID = req.body.id;
//     let fetchedCart;
//     let newQuantity = 1;
//     let fetchedProduct = Product.findByPk(prodID);
//     let productQuantity;
//     fetchedProduct.then(productItem => {
//         if (productItem) {
//             productQuantity = productItem.quantity;
//             if (productQuantity) {
//                 createCartIfNotFound(req.user)
//                     .then(cart => {
//                         fetchedCart = cart;
//                         return cart.getProducts({
//                             where: {
//                                 id: prodID
//                             }
//                         })
//                     }).then(products => {
//                     if (products.length) {
//                         // increase quantity
//                         newQuantity = products[0].cartItem.quantity + 1;
//                         if (newQuantity <= productQuantity) {
//                             fetchedCart.addProduct(products[0], {through: {quantity: newQuantity}}).then(() => {
//                                 res.send('product has been updated successfully');
//                             }).catch(err => {
//                                 console.log(err);
//                             })
//                         } else {
//                             res.status(405).send('Product is out of stock');
//                         }
//
//                     } else {
//                         // add product to the cart
//                         // fetchedProduct.then(product => {
//                         fetchedCart.addProduct(productItem, {
//                             through: {
//                                 quantity: newQuantity
//                             }
//                         }).then(() => {
//                             res.send('product has been added successfully');
//                         }).catch(err => {
//                             console.log(err);
//                         })
//                         // }).catch(err => {
//                         //     console.log(err);
//                         // })
//                     }
//                 }).catch(err => {
//
//                 });
//             } else {
//                 res.status(405).send('product is out of stock!');
//             }
//         } else {
//             res.status(404).send('product not found!');
//         }
//     });
//
// };
//
exports.removeItem = (req, res, next) => {
    const prodId = req.params.code;

    req.user.removeFromCart(prodId).then(() => {
        res.send('Item has been removed!');
    }).catch(err => {
        console.log(err);
    });
    // let fetchedCart;
    // req.user.getCart().then(cart => {
    //     fetchedCart = cart;
    //     return cart.getProducts({
    //         where: {
    //             id: prodId
    //         }
    //     })
    // }).then(products => {
    //     if (products.length) {
    //         const product = products[0];
    //         let newQuantity = product.cartItem.quantity - 1;
    //         if (product.cartItem.quantity > 1) {
    //             // decrease quantity
    //             fetchedCart.addProduct(product, {through: {quantity: newQuantity}}).then(() => {
    //                 res.send('One item has been removed');
    //             }).catch(err => {
    //                 console.log(err);
    //             })
    //         } else {
    //             // remove from cart
    //             product.cartItem.destroy().then(() => {
    //                 res.send('Product has been removed from the cart!');
    //             }).catch(err => {
    //                 console.log(err);
    //             })
    //         }
    //     }
    //     else {
    //         res.status(404).send({message: 'Product was not found'})
    //     }
    // }).catch(err => console.log(err))
};
//
exports.getOrders = (req, res, next) => {
    Order.find({userId: req.user.id}).then(orders => {
        res.send(orders);
    }).catch(err => {
        console.log(err);
    })
    // User.getOrders(req.user._id).then(orders => {
    //     res.send(orders);
    // }).catch(err => {
    //     console.log(err);
    // })
    // req.user.getOrders({include: 'products'}).then(orders => {
    //     res.send(orders);
    // }).catch(err => {
    //     console.log(err);
    // })
};

exports.createOrder = (req, res, next) => {
    req.user.populate('cart.prodId').execPopulate().then(user => {
        let updatedCart = [...user.cart].map(item => {
            return {data: {...item.prodId._doc}, quantity: item.quantity}
        });

        let newOrder = new Order({items: updatedCart, userId: req.user._id});
        return newOrder.save();
    }).then(() => {
        req.user.clearCart().then(() => {
            res.send('order submitted successfully');
        });
    }).catch(err => {
        console.log(err);
    })
    // Product.getProducts(req.user.cart).then(products => {
    //     return User.createOrder(req.user._id, products)
    // }).then(() => {
    //     User.removeFromCart(req.user._id, []).then(() => {
    //         res.send('order has been submitted successfully!');
    //     }).catch(err => {
    //         console.log(err);
    //     });
    // }).catch(err => {
    //     console.log(err);
    // })

    // req.user.getCart().then(cart => {
    //     fetchedCart = cart;
    //     return cart.getProducts()
    // }).then(products => {
    //     if (products.length) {
    //         req.user.createOrder().then(order => {
    //             order.addProducts(products.map(product => {
    //                 product.orderItem = {quantity: product.cartItem.quantity}
    //                 return product
    //             })).then(() => {
    //                 fetchedCart.setProducts(null).then(() => {
    //                     res.send('order has been submitted successfully!');
    //                 }).catch(err => {
    //                     res.status(405).send(err);
    //                 });
    //             }).catch(err => {
    //                 res.status(405).send(err);
    //             })
    //         }).catch(err => {
    //             res.status(405).send(err);
    //         })
    //     } else {
    //         res.status(405).send('Cart is empty!');
    //     }
    //
    // }).catch(err => {
    //     res.status(405).send(err);
    // })

};
exports.getInvoice = (req, res, next) => {
    const fileName = `invoice-${req.params.orderId}.pdf`;
    const filePath = path.join(rootDir, 'invoices', fileName);
    const dataStream = fs.createReadStream(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    dataStream.pipe(res);
    // fs.readFile(filePath, (err, data) => {
    //     if (err) {
    //         return next(err)
    //     }
    //     res.setHeader('Content-Type', 'application/pdf');
    //     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    //     res.send(data);
    // })
};


exports.postCreateCheckoutSessionId = (req, res, next) => {
    stripe.checkout.sessions.create(
        {
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        unit_amount: 450,
                        product_data: {
                            name: 'test'
                        },
                        currency: 'EGP'
                    },
                    quantity: 2
                },
                {
                    price_data: {
                        unit_amount: 150,
                        product_data: {
                            name: 'test 2'
                        },
                        currency: 'EGP'
                    },
                    quantity: 1
                },
            ],
        },
        function (err, paymentMethod) {
            // asynchronously called
            if (err) {
                next(err);
            } else {
                res.send(paymentMethod)
            }
        }
    );
};
