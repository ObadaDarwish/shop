const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    const page = req.query.page;
    // {attributes:['id','name','description','price','quantity']}
    // req.user.getProducts().then((result) => {
    //     if (result.length) {
    //         res.send(result);
    //     }
    //     else {
    //         res.status(404).send({message: 'No Products yet for this user'})
    //     }
    // }).catch((err) => {
    //     res.status(405).send(err.errors);
    // })
    let totalProducts = 0;
    Product.find({userId: req.user._id})
        .count().then(numberOfOrders => {
        totalProducts = numberOfOrders;
        Product.find({userId: req.user._id})
            .skip((page - 1) * 2)
            .limit(2)
            .then(products => {
                if (products.length) {
                    res.send({data: products, total: totalProducts,orders_per_page:2});
                } else {
                    res.status(404).send({message: 'No Products were found.'})
                }
            }).catch(err => {
            res.status(405).send(err.errors);
        })

    }).catch(err => {
        next(err);
    })

};
exports.getProduct = (req, res, next) => {
    Product.findById(req.params.code).then(product => {
        // if (product.length) {
        res.status(200).send(product);
        // } else {
        //     res.status(404).send({message: 'Can not find product with the provided id.'})
        // }
    }).catch(err => {
        res.status(404).send(err);
    });
    // req.user.getProducts({where: {id: req.params.code}})
    //     .then(product => {
    //         if (product.length) {
    //             res.status(200).send(product[0]);
    //         } else {
    //             res.status(404).send({message: 'Can not find product with the provided id.'})
    //         }
    //     }).catch(err => {
    //     res.status(404).send(err);
    // });
};
exports.postAddProduct = (req, res, next) => {
    // const {name, description, price, quantity} = req.body;
    // let newProduct = new Product(name, description, price, quantity, req.user._id);
    const file = req.file;
    console.log(file);
    if (!file) {
        let error = new Error();
        error = {...error, statusCode: 403, message: 'file type is not supported'};
        throw error;
    }
    let newProduct = new Product({...req.body, userId: req.user._id});
    newProduct.save().then(result => {
        res.status(200).send('product has been added successfully!');
    }).catch(err => {
        console.log(err);
    });
    // req.user.createProduct({...req.body})
    //     .then(() => {
    //         res.status(200).send('product has been added successfully!');
    //     }).catch(err => {
    //     const {errors} = err;
    //     res.status(504).send(errors)
    // })
};
exports.putEditProducts = (req, res, next) => {
    Product.findById(req.params.code).then(product => {
        Object.assign(product, req.body);
        return product.save()
    }).then(() => {
        res.send('product updated successfully')
    }).catch(err => {
        res.status(504).send(err);
    });
    // Product.updateProduct(req.params.code, req.body).then(() => {
    //     res.send('product updated successfully')
    // }).catch(err => {
    //     res.status(504).send(err);
    // });
    // Product.update({
    //     ...req.body
    // }, {
    //     where: {
    //         id: req.params.code
    //     }
    // }).then(() => {
    //     res.send('product updated successfully')
    // }).catch(err => {
    //     res.status(504).send(err);
    // });
}

exports.deleteProducts = (req, res, next) => {
    Product.findByIdAndRemove(req.params.code).then(() => {
        res.send('product has been deleted successfully')
    }).catch(err => {
        res.status(504).send(err);
    });
    // Product.destroy({
    //     where: {
    //         id: req.params.code
    //     }
    // }).then(() => {
    //     res.send('product has been deleted successfully')
    // }).catch(err => {
    //     res.status(504).send(err);
    // });
};
