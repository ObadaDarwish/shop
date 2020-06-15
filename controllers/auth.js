const User = require('../models/user');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SENDGRID_API_KEY);

exports.postSignUp = (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body;

    User.findOne({email: email}).then((user) => {
        if (user) {
            res.status(405).send('User already exists');
        } else {
            bcryptjs.hash(password, 12).then((hashedPassword) => {
                let newUser = new User({name, email, password: hashedPassword});
                newUser.save().then(() => {
                    const msg = {
                        to: email,
                        from: 'darwishobada@gmail.com',
                        subject: 'Sending with SendGrid is Fun',
                        text: 'and easy to do anywhere, even with Node.js',
                        html: '<h1>User was successfully created</h1>',
                    };

                    sgMail.send(msg).then(() => {
                        console.log('email was send successfully')
                    }).catch(err => {
                        console.log(err);
                    });
                    res.send('User was successfully created');
                }).catch(err => {
                    console.log(err);
                });
            })

        }
    }).catch(err => {
        console.log(err);
    })

};
exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
    User.findOne({email: email}).then(user => {
        if (user) {
            bcryptjs.compare(password, user.password).then((match) => {
                if (match) {
                    let userObj = user.toObject();
                    delete userObj.password;
                    jwt.sign(userObj, config.JWT_SECRET, function (err, token) {
                        res.send({user: userObj, token: token});
                    });

                } else {
                    res.status(405).send({message: 'Invalid email or password!'});
                }
            }).catch(err => {
                console.log(err);
            })
        } else {
            res.status(405).send({message: 'Invalid email or password!'})
        }
    }).catch(err => {
        console.log(err)
    });
};

exports.resetPassword = (req, res, next) => {
    let token;
    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            crypto.randomBytes(32, (err, buffer) => {
                if (!err) {
                    token = buffer.toString('hex');
                    user.resetToken = token;
                    user.resetTokenExpiration = Date.now() + 3600000;
                    user.save().then(() => {
                        const msg = {
                            to: req.body.email,
                            from: 'obada_567@hotmail.co.uk',
                            subject: 'Resetting password',
                            html: `<h1>You requested a password reset</h1>
            <p>click on this <a href="http://dsasdasd.com/resetPassword/${token}">Link</a> to reset your password</p>
                `,
                        };
                        sgMail.send(msg).then(() => {
                            res.send('reset password email was successfully sent to the user');
                        }).catch(err => {
                            console.log(err);
                        });

                    })
                }
            })
        }

    }).catch(err => {
        console.log(err);
    })
};

exports.updatePassword = (req, res, next) => {
    const {resetToken, newPassword} = req.body;
    User.findOne({resetToken: resetToken, resetTokenExpiration: {$gt: Date.now()}}).then(user => {
        if (user) {
            bcryptjs.hash(newPassword, 12).then((hashedPassword) => {
                user.password = hashedPassword;
                user.resetToken = null;
                user.save().then(() => {
                    res.send('Password has been updated successfully');
                }).catch(err => {
                    console.log(err)
                })
            })

        } else {
            res.status(405).send('Token has expired.')
        }
    }).catch(err => {
        console.log(err);
    })
};
