//common required modules
const fs = require('fs');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const response = [];
const passPattern = /^.{8,20}$/i;
const NativeLoginType = 'N';

//fetch user profile api
module.exports.fetchProfile = function (req, res) {
    const schema = Joi.object().keys({
        'user_id': Joi.string().required().error(new Error('Please fill the user id first!')),
        'access_token': Joi.string().required().error(new Error('Please fill the access token first!')),
    });

    Joi.validate({
        'user_id': req.body.userId,
        'access_token': req.body.access_token,
    }, schema, function (err, value) {

        if (err) {
            res.json({
                status: false,
                response: response,
                message: err.message
            });

        } else {
            let userData = "SELECT id AS user_id,user_name,user_email,user_image,user_mobile_country_code,user_mobile,user_login_type,user_access_token FROM `users` WHERE id='" + req.body.userId + "' AND user_access_token = '"+req.body.access_token+"'";
            db.query(userData, (err, result) => {
                if (result.length > 0) {
                    res.json({
                        status: true,
                        response: result,
                        message: 'user fetched data is here!'
                    });
                } else {
                    res.json({
                        status: false,
                        response: response,
                        message: 'userId or access token does exist!please check and try again! '
                    });
                }
            });
        }
    });
}

//upload user profile image api
module.exports.uploadProfileImage = function (req, res) {
    const schema = Joi.object().keys({
        'user_id': Joi.string().required().error(new Error('Please fill the user id first!')),
        'access_token': Joi.string().required().error(new Error('Please fill the access token first!')),
    });
    Joi.validate({
        'user_id': req.body.userId,
        'access_token': req.body.access_token,
    }, schema, function (err, value) {

        if (err) {
            res.json({
                status: false,
                response: response,
                message: err.message
            });

        } else if (!req.files) {
            res.json({
                status: false,
                response: response,
                message: 'please choose image first!'
            });

        } else {
            let checkUserQuery = "SELECT * FROM `users` WHERE id='" + req.body.userId + "' AND user_access_token = '" + req.body.access_token + "'";
            db.query(checkUserQuery, (err, result) => {
                if (result.length > 0) {
                    let uploadedFile = req.files.image;
                    let fileExtension = uploadedFile.mimetype.split('/')[1];
                    let randomNumber = Math.floor(100000000 + Math.random() * 900000000);
                    let image_title = randomNumber + Date.now();
                    // console.log(image_title);
                    //console.log(uploadedFile);
                    let imageName = 'http://18.218.65.91:3000/assets/img/user_images/' + image_title + '.' + fileExtension;
                    if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                        uploadedFile.mv(`./public/assets/img/user_images/${image_title + '.' + fileExtension}`, function (err, success) {
                            if (err) {
                                res.json({
                                    status: false,
                                    response: err,
                                    message: 'Something went wrong'
                                })
                            } else {
                                //console.log('success');
                                let UpdateProfileImage = "UPDATE `users` SET `user_image` = '" + imageName + "' WHERE id = '" + req.body.userId + "'";
                                //console.log(UpdateProfileImage);
                                db.query(UpdateProfileImage, (err, result) => {
                                    if (err) {
                                        res.json({
                                            status: false,
                                            response: err,
                                            message: 'Something went wrong'
                                        })
                                    } else {
                                        res.json({
                                            status: true,
                                            response: {
                                                "user_id": req.body.userId,
                                                "user_image": imageName,
                                                "access_token": req.body.access_token
                                            },
                                            message: 'User image uploaded successfully!'
                                        });

                                    }

                                });

                            }

                        });

                    } else {
                        res.json({
                            status: false,
                            response: response,
                            message: 'Invalid File format. Only gif, jpeg and png images are allowed'
                        })
                    }

                } else {
                    res.json({
                        status: false,
                        response: response,
                        message: 'Invalid user_id or access_token!'
                    });
                }
            });
        }
    });
}

//change user password
module.exports.changePassword = function (req, res) {
    const schema = Joi.object().keys({
        'user_id': Joi.string().required().error(new Error('Please fill the user id first!')),
        'access_token': Joi.string().required().error(new Error('Please fill the access token first!')),
        'old_password': Joi.string().regex(passPattern).required().error(new Error('Please fill user correct current password first!')),
        'new_password': Joi.string().regex(passPattern).required().error(new Error('Please fill the correct new password first!(hint: must be min 8 max 20 characters)')),
    });
    Joi.validate({
        'user_id': req.body.userId,
        'access_token': req.body.access_token,
        'old_password': req.body.old_password,
        'new_password': req.body.new_password,
    }, schema, function (err, value) {

        if (err) {
            res.json({
                status: false,
                response: response,
                message: err.message
            });

        } else {
            let checkUserQuery = "SELECT * FROM `users` WHERE id='" + req.body.userId + "' AND user_access_token = '" + req.body.access_token + "' AND user_login_type = '" + NativeLoginType + "'";
            db.query(checkUserQuery, (err, result) => {
                if (result.length > 0) {
                    let validPass = bcrypt.compareSync(req.body.old_password, result[0].user_password);
                    if (validPass == true) {
                        let newPass = bcrypt.hashSync(req.body.new_password, 10);
                        let query = "UPDATE `users` SET `user_password` = '" + newPass + "' WHERE `users`.`id` = '" + req.body.userId + "'";
                        db.query(query, (err, result) => {
                            if (err) {
                                res.json({
                                    status: false,
                                    response: err,
                                    message: 'something went wrong!'
                                })

                            } else {
                                res.json({
                                    status: true,
                                    response: {"user_id": req.body.userId, "access_token": req.body.access_token},
                                    message: "password changed successfully"
                                });

                            }

                        });
                    } else {
                        res.json({
                            status: false,
                            response: response,
                            message: 'sorry!Invalid old password..Check your password!'
                        })
                    }
                } else {
                    res.json({
                        status: false,
                        response: response,
                        message: 'Invalid user_id or access_token!'
                    });
                }
            });
        }

    });
}
//update user profile data
module.exports.updateProfile = function (req, res) {
    const schema = Joi.object().keys({
        'user_id': Joi.string().required().error(new Error('Please fill the user id first!')),
        'access_token': Joi.string().required().error(new Error('Please fill the access token first!')),
        'name': Joi.string().required().error(new Error('Please fill user name first!')),
        'email': Joi.string().email().error(new Error('Please fill the correct email first!')),
    });
    Joi.validate({
        'user_id': req.body.userId,
        'access_token': req.body.access_token,
        'name': req.body.name,
        'email': req.body.email,
    }, schema, function (err, value) {

        if (err) {
            res.json({
                status: false,
                response: response,
                message: err.message
            });

        } else {
            let checkUserQuery = "SELECT * FROM `users` WHERE id='" + req.body.userId + "' AND user_access_token = '" + req.body.access_token + "'";
            db.query(checkUserQuery, (err, result) => {
                if (result.length > 0) {
                    let updateUserInfo = "UPDATE `users` SET `user_name` = '" + req.body.name + "',`user_email` ='" + req.body.email + "' WHERE id ='" + req.body.userId + "'";
                    db.query(updateUserInfo, (err, result) => {
                        if (err) {
                            res.json({
                                status: false,
                                response: err,
                                message: 'something went wrong!'
                            });
                        } else {
                            res.json({
                                status: true,
                                response: {"user_id": req.body.userId, "access_token": req.body.access_token},
                                message: 'user info updated successfully!'
                            });

                        }
                    });
                } else {
                    res.json({
                        status: false,
                        response: response,
                        message: 'Invalid user_id or access_token!'
                    });
                }
            });
        }
    });
}

//add user addition information api
module.exports.userInfo = function (req, res) {
    const schema = Joi.object().keys({
        'user_id': Joi.string().required().error(new Error('Please fill the user id first!')),
        'access_token': Joi.string().required().error(new Error('Please fill the access token first!')),
        'user_lat': Joi.string().required().error(new Error('Please fill user latitude first!')),
        'user_long': Joi.string().required().error(new Error('Please fill the user longitude first!')),
        'user_device_type': Joi.string().valid('A', 'I').required().error(new Error('Please fill the correct user device type first(valid:A,I)!')),
        'user_device_token': Joi.string().required().error(new Error('Please fill the user device token first!')),
    });
    Joi.validate({
        'user_id': req.body.userId,
        'access_token': req.body.access_token,
        'user_lat': req.body.user_lat,
        'user_long': req.body.user_long,
        'user_device_type': req.body.user_device_type,
        'user_device_token': req.body.user_device_token,
    }, schema, function (err, value) {

        if (err) {
            res.json({
                status: false,
                response: response,
                message: err.message
            });

        } else {
            //check if user exists or not
            let checkUserQuery = "SELECT * FROM `users` WHERE id='" + req.body.userId + "' AND user_access_token = '" + req.body.access_token + "'";
            db.query(checkUserQuery, (err, result) => {
                if (result.length > 0) {
                    let user_info = {
                        "user_id": req.body.userId,
                        "user_lat": req.body.user_lat,
                        "user_long": req.body.user_long,
                        "user_device_type": req.body.user_device_type,
                        "user_device_token": req.body.user_device_token,
                    }
                    let checkUserInfo = "SELECT * FROM `users_info` WHERE user_id = '"+req.body.userId+"'";
                    db.query(checkUserInfo, (err, result) => {
                        if(result.length > 0){
                  let updateInfo = "UPDATE `users_info` SET user_id='"+req.body.userId+"',user_lat='"+req.body.user_lat+"',user_long='"+req.body.user_long+"',user_device_type='"+req.body.user_device_type+"',user_device_token='"+req.body.user_device_token+"' WHERE id = '"+result[0].id+"'";
                            db.query(updateInfo, (err, result) => {
                                if(err){
                                    res.json({
                                        status: false,
                                        response: err,
                                        message: 'there are some error with query'
                                    })
                                }
                                else{
                                    res.json({
                                        status: true,
                                        response: {"user_id":req.body.userId,"access_token":req.body.access_token},
                                        message: 'user info already exists and updated successfully'
                                    })
                                }
                            });
                        }
                        else{
                            db.query('INSERT INTO users_info SET ?', user_info, function (error, results, fields) {
                                if (error) {
                                    res.json({
                                        status: false,
                                        response: error,
                                        message: 'there are some error with query'
                                    })
                                } else {
                                    res.json({
                                        status: true,
                                        response: {"user_id": req.body.userId, "access_token": req.body.access_token},
                                        message: 'user information added successfully'
                                    })
                                }
                            });
                        }
                    });

                } else {
                    res.json({
                        status: false,
                        response: response,
                        message: 'Invalid user_id or access token!please check and try again!'
                    });
                }
            });
        }
    });
}