const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find().then(result => {
        res.send(result);
    }).catch(err => {
        res.status(504).send(err);
    })
    // User.getUsers().then(result => {
    //     res.send(result);
    // }).catch(err => {
    //     res.status(504).send(err);
    // })

    // User.findAll().then(result => {
    //     res.send(result);
    // }).catch(err => {
    //     res.status(504).send(err);
    // })

});
router.get('/:code', (req, res, next) => {
    // User.getUser(req.params.code).then(result => {
    //     res.send(result);
    // }).catch(err => {
    //     res.status(504).send(err);
    // })
    User.find({_id: req.params.code}).then(result => {
        res.send(result);
    }).catch(err => {
        // res.status(404).send(err);
        const error = new Error(err);
        error.statusCode = 404;
        next(error);
    })

});
router.post('/add', (req, res, next) => {
    // User.create({...req.body}).then(() => {
    //     res.send('user added successfully');
    // }).catch(err => {
    //     res.status(504).send(err);
    // })
    // const {name, email} = req.body;
    let newUser = new User(req.body);
    newUser.save().then(() => {
        res.send('user added successfully');
    }).catch(err => {
        res.status(405).send(err);
    })
});

module.exports = router;
