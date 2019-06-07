//Constant common declarations node module/package
const Joi = require('joi');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const response = [];
const mobilePattern = /^.{10}$/i;
const otpPattern = /^.{4}$/i;
const Countrycode = /^\+?\d+$/i;
const passPattern = /^.{8,20}$/i;
const accountSid = 'ACfdb83c98eab138cffbd6114ed690bbba';
const authToken = '1be5d817b06f37a53989cfc6dace8d96';
const client = require('twilio')(accountSid, authToken);
const varify_status = 1;
const unverify_status = 0;



//for register users in app

module.exports.registerUser = function (req, res) {

    //validate all the params
    const schema = Joi.object().keys({
        'name': Joi.string().required().error(new Error('Please fill the user name first and it must be a alpha numeric only')),
        'email': Joi.string().email().required().error(new Error('Please fill the correct email first')),
        'country_code': Joi.string().regex(Countrycode).required().error(new Error('please fill the correct country code first')),
        'mobile': Joi.string().regex(mobilePattern).required().error(new Error('please fill the correct mobile number first')),
        'password': Joi.string().regex(passPattern).required().error(new Error('please fill the correct password first.(Hint::min length 8 & maximum 20)'))
    });

    Joi.validate({
        'name': req.body.name,
        'email': req.body.email,
        'country_code': req.body.country_code,
        'mobile': req.body.mobile,
        'password': req.body.password,
    }, schema, function (err, value) {

        if (err) {
            res.json({
                status: false,
                response: response,
                message: err.message
            });

        } else {
            //check if user already exists or not
            let userEmailQuery = "SELECT * FROM `users` WHERE user_email= '" + req.body.email + "' OR user_mobile ='"+req.body.mobile+"'";
            db.query(userEmailQuery, (err, result) => {
                if(result.length > 0 ) {
                    if (result[0].user_email == req.body.email) {
                        res.json({
                            status: false,
                            response: response,
                            message: 'Sorry!user email already exists!'
                        })

                    } else if (result[0].user_mobile == req.body.mobile) {
                        res.json({
                            status: false,
                            response: response,
                            message: 'Sorry!user mobile already exists!'
                        })


                    }
                }

                else {
                    //generate 4 digits otp number
                    let Otp = Math.floor(1000 + Math.random() * 9000);
                    //otp message to user with twilio
                    let message = 'Confirm Your one time password to complete registration process.Your OTP is ' + Otp;
                    client.messages
                        .create({
                            body: message,
                            from: '+12048176037',
                            to: req.body.country_code + req.body.mobile
                        }, function (error, message) {
                            if (error) {
                                res.json({
                                    status: false,
                                    response: response,
                                    message: error.message,
                                })
                            } else {
                                //generate access token for user
                                let token = crypto.randomBytes(32).toString('hex');
                                //define user object
                                const user = {
                                    'user_name': req.body.name,
                                    'user_email': req.body.email,
                                    'user_mobile_country_code': req.body.country_code,
                                    'user_mobile': req.body.mobile,
                                    'user_password': bcrypt.hashSync(req.body.password, 10),
                                    "user_access_token": token,
                                    'user_login_type': 'N',
                                    'user_otp': Otp,
                                }
                                db.query('INSERT INTO users SET ?', user, function (error, results, fields) {
                                    if (error) {
                                        res.json({
                                            status: false,
                                            response: error,
                                            message: 'there are some error with query'
                                        })
                                    } else {
                                        res.json({
                                            status: true,
                                            response: {
                                                "user_id": results.insertId,
                                                "login_type": 'N',
                                                "access_token": token
                                            },
                                            message: 'user registered successfully',

                                        })
                                    }
                                });
                            }
                        });
                }
            });
        }
    });
}
//to verify user otp to complete registration
module.exports.verifyOtp = function (req, res) {
    //validate all the params
    const schema = Joi.object().keys({
        'user_id': Joi.string().required().error(new Error('Please fill the user id first!')),
        'user_otp': Joi.string().regex(otpPattern).required().error(new Error('Please fill the correct user otp first!(Hint: 1234,5654)')),

    });
    Joi.validate({
        'user_id': req.body.userId,
        'user_otp': req.body.otp,
    }, schema, function (err, value) {

        if (err) {
            res.json({
                status: false,
                response: response,
                message: err.message
            });
        } else {
            let userQuery = "SELECT * FROM `users` WHERE id ='" + req.body.userId + "' AND user_otp_verified ='" + unverify_status + "'";
            db.query(userQuery, (err, result) => {
                if (result.length > 0) {
                    if (result[0].user_otp === req.body.otp) {
                        let UpdateOtpStatus = "UPDATE `users` SET user_otp_verified = '" + varify_status + "' WHERE id = '" + req.body.userId + "'";
                        db.query(UpdateOtpStatus, (err, result) => {
                            if (err) {
                                res.json({
                                    status: false,
                                    response: err,
                                    message: 'something went wrong!'
                                })
                            } else {
                                res.json({
                                    status: true,
                                    response: {'userId': req.body.userId, 'verify_otp_status': 1},
                                    message: 'User otp process completed successfully.'
                                })
                            }

                        });

                    } else {
                        res.json({
                            status: false,
                            response: response,
                            message: 'You entered wrong otp.Please check and try again!'
                        })
                    }
                } else {
                    res.json({
                        status: false,
                        response: response,
                        message: 'No User Found or user mobile is already verified.'
                    })
                }
            });
        }
    });
}

//resend otp to users mobile
module.exports.resendOtp = function (req, res) {
    const schema = Joi.object().keys({
        user_id: Joi.string().required().error(new Error('Please fill the correct user id first!')),
    });
    Joi.validate({
        'user_id': req.body.userId,
    }, schema, function (err, value) {
        if (err) {
            res.json({
                status: false,
                response: response,
                message: err.message
            });
        } else {
            let userQuery = "SELECT * FROM `users` WHERE id ='" + req.body.userId + "' AND user_otp_verified ='" + unverify_status + "'";
            db.query(userQuery, (err, result) => {
                if (result.length > 0) {
                    let message = 'Confirm Your one time password to complete registration process.Your OTP is ' + result[0].user_otp;
                    client.messages
                        .create({
                            body: message,
                            from: '+12048176037',
                            to: result[0].user_mobile_country_code + result[0].user_mobile
                        }, function (error, message) {
                            if (!error) {
                                res.json({
                                    status: true,
                                    response: {'userId': req.body.userId},
                                    message: 'Otp successfully sent to user mobile number '
                                })

                            } else {
                                res.json({
                                    status: false,
                                    response: error.message,
                                    message: 'Something went wrong.'
                                })
                            }

                        });

                } else {
                    res.json({
                        status: false,
                        response: response,
                        message: 'Sorry user not found or user otp already verified!.'
                    })
                }

            });
        }
    });
}
//social login api starts
module.exports.socialLogin = function (req, res) {
    //validate user login type
    const schema = Joi.object().keys({
        email: Joi.string().email().allow('').error(new Error('Please fill the correct email first!')),
        login_type: Joi.string().valid('F', 'G').required().error(new Error('Please fill the correct login_type first(hint:F for facebook & G for google)')),
    });
    Joi.validate({
        'login_type': req.body.login_type,
        'email': req.body.user_email,
    }, schema, function (err, value) {
        if (err) {
            res.json({
                status: false,
                response: response,
                message: err.message
            });
        }
        else if (req.body.login_type == 'F' && req.body.facebookId == '') {
            res.json({
                status: false,
                response: response,
                message: 'please fill facebook id first!'
            });

        } else if (req.body.login_type == 'G' && req.body.googleId == '') {
            res.json({
                status: false,
                response: response,
                message: 'please fill google id first!'
            });
        }
        else if (req.body.login_type == 'F' && req.body.googleId != '') {
            res.json({
                status: false,
                response: response,
                message: 'sorry!Google id is not allowed with login type F.'
            });

        } else if (req.body.login_type == 'G' && req.body.facebookId != '') {
            res.json({
                status: false,
                response: response,
                message: 'sorry!Facebook id is not allowed with login type G.'
            });
        }
        else {
            let checkUsers = "SELECT * FROM `users` WHERE (google_id ='" + req.body.googleId + "' AND user_login_type = 'G')  OR (facebook_id ='" + req.body.facebookId + "' AND user_login_type='F')";
            db.query(checkUsers, (err, result) => {
                if (result.length > 0) {
                    let userID;
                    let token = crypto.randomBytes(32).toString('hex');
                    userID = result[0].id;
                    let UpdateAccessToken="UPDATE `users` SET `user_access_token` ='"+token+"' WHERE id= '"+userID+"'";
                   // console.log(UpdateAccessToken);
                    db.query(UpdateAccessToken, (err, result) => {
                        if(err){
                            res.json({
                                status: false,
                                response: response,
                                message: 'something went wrong!'
                            })
                        }
                        res.json({
                            status: true,
                            response: {
                                "user_id":userID,
                                "access_token": token,
                                "user_login_type": req.body.user_login_type
                            },
                            message: 'User already exists and login successfully'
                        })

                    });


                }  else {
                    let token = crypto.randomBytes(32).toString('hex');
                    let user_details = {
                        "user_name": req.body.user_name,
                        "google_id": req.body.googleId,
                        "facebook_id": req.body.facebookId,
                        "user_login_type": req.body.login_type,
                        "user_email": req.body.user_email,
                        "user_image": req.body.user_image,
                        "user_access_token": token,
                    }
                    db.query('INSERT INTO users SET ?', user_details, function (error, results, fields) {
                        if (error) {
                            res.json({
                                status: false,
                                response: error,
                                message: 'Something Went Wrong!'
                            })

                        } else {
                            res.json({
                                status: true,
                                response: {
                                    "user_id": results.insertId,
                                    "access_token": token,
                                    "user_login_type": req.body.login_type
                                },
                                message: 'User register and login successfully'
                            })
                        }
                    });
                }

            });
        }
    });
}
