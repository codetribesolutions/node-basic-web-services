//Constant common declarations node module/package
const fs = require('fs');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const response = [];
const passPattern = /^.{8,20}$/i;
const native_login_type = 'N';
const ejs = require("ejs");
// configure email credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adarshsharma002@gmail.com',
        pass: '9129393002'
    }
});

//user login api start
module.exports.userLogin = function (req, res) {
    //validate all the params
    const schema = Joi.object().keys({
        'email': Joi.string().email().required().error(new Error('Please fill the correct email first')),
        'password': Joi.string().required().error(new Error('please fill the correct password first!'))
    });
    Joi.validate({
        'email': req.body.email,
        'password': req.body.password,
    }, schema, function (err, value) {

        if (err) {

            res.json({
                status: false,
                response: response,
                message: err.message
            });

        } else {
            let token = crypto.randomBytes(32).toString('hex');
            db.query('SELECT * FROM users WHERE user_email = ? ', [req.body.email], function (error, results, fields) {

                if (results.length > 0) {
                    let validPass = bcrypt.compareSync(req.body.password, results[0].user_password);
                    if (validPass == true && results[0].user_otp_verified != '0') {
                     let UpdateAccessToken="UPDATE `users` SET `user_access_token` ='"+token+"' WHERE id= '"+results[0].id+"'";
                        db.query(UpdateAccessToken, (err, result) => {
                            if(err){
                                res.json({
                                    status: false,
                                    response: response,
                                    message: 'something went wrong!'
                                })

                            }

                            else {
                                res.json({
                                    status: true,
                                    response: {
                                        "user_id": results[0].id,
                                        "login_type": results[0].user_login_type,
                                        "access_token": token,
                                        "verify_otp_status":1
                                    },
                                    message: 'user login successfully!'
                                })
                            }
                        });

                    }
                    else if(validPass == true && results[0].user_otp_verified != '1'){
                        let UpdateAccessToken="UPDATE `users` SET `user_access_token` ='"+token+"' WHERE id= '"+results[0].id+"'";
                        db.query(UpdateAccessToken, (err, result) => {});
                        res.json({
                            status: true,
                            response: {
                                "user_id": results[0].id,
                                "login_type": results[0].user_login_type,
                                "access_token": token,
                                "verify_otp_status":0
                            },
                            message: 'Verify Your Mobile Number first to continue login!'
                        })
                    }

                    else {
                        res.json({
                            status: false,
                            response: response,
                            message: 'sorry!Invalid credentials..Check your email or password'
                        })
                    }

                } else {
                    res.json({
                        status: false,
                        response: response,
                        message: 'sorry!user does not exists!'
                    })

                }

            });
        }
    });
}

//forgot password api start
module.exports.forgotPassword = function (req,res,next) {
    //validate email
    const schema = Joi.object().keys({
        'email': Joi.string().email().required().error(new Error('Please fill the correct email first')),
    });
    Joi.validate({
        'email': req.body.email,
}, schema, function (err, value) {

        if(err){
            res.json({
                status: false,
                response: response,
                message: err.message
            });
        }
        else{
            async.waterfall([
                function(done) {
                    crypto.randomBytes(20, function(err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) {
                    let userQuery = "SELECT * FROM `users` WHERE user_email = '" + req.body.email + "' AND user_login_type='"+native_login_type+"'";
                    db.query(userQuery, (err, result) => {
                        if(result.length > 0){
                            let resetPasswordToken = token;
                            let updateTokenQuery = "UPDATE `users` SET `remember_token` = '" + resetPasswordToken + "' WHERE `users`.`user_email` = '" + req.body.email + "'";
                            db.query(updateTokenQuery,(err,result) => {

                                done(err, token, result);

                            });
                        }else{
                            res.json({
                                status: false,
                                response:response,
                                message: 'sorry!email does not exist or user login type is not found.'
                            })
                        }
                        //done(err, token, result);
                    });

                },
                function(token, result, done) {
                    let userQuery = "SELECT * FROM `users` WHERE user_email = '" + req.body.email + "'";
                    db.query(userQuery, (err, results) => {
                        ejs.renderFile(__dirname + "/../views/email_template.ejs", { token: token }, function (err, data) {
                            if (err) {
                                console.log(err);
                            }

                        let mailOptions = {
                            from: 'contact@codetribesolutions.com',
                            to: results[0].user_email,
                            subject: 'Reset Password Email',
                            html: data
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        });
                        res.json({
                            status: true,
                            response:{"user_id": results[0].id,"user_email": results[0].user_email},
                            message: 'user reset password link sent successfully',

                        }) });
                }

            ], function(err) {
                if (err) return next(err);

            });

        }

    });

}
//show reset page on browser
exports.resetPassword=function(req,res){
    let token = req.params.token;
    res.render('reset-password.ejs', {
        title:'change your password',
        token:token,
    });
}
//reset password from browser window

module.exports.ResetpasswordNow=function (req,res) {
    let token = req.body.token;
    //validate email
    const schema = Joi.object().keys({
        'password': Joi.string().regex(passPattern).required().error(new Error('Please fill the correct password first(hint :: min 8 max 20 characters)')),
        'c_password': Joi.any().valid(Joi.ref('password')).required().error(new Error('Fill confirm password first and must same as password')),
    });
    Joi.validate({
        'password': req.body.new_pass,
        'c_password': req.body.confirm_pass,
    }, schema, function (err, value) {

        if (err) {
            req.flash('error', err.message);
            res.redirect('back');
        }
        else{
            let userId;
            let query = "SELECT * FROM `users` WHERE remember_token = '"+token+"'";
            db.query(query,(err,result)=> {
                if (result.length > 0) {
                    userId = result[0].id;
                    let updatePass = "UPDATE `users` SET `user_password` = '" + bcrypt.hashSync(req.body.new_pass,10) + "' WHERE `id` = '" + result[0].id + "'";
                    db.query(updatePass, (err, result) => {

                   let removeToken = "UPDATE `users` SET `remember_token` = NULL WHERE id = '"+userId+"'";
                        db.query(removeToken, (err, result) => {


                        });
                        req.flash('success', 'password reset successfully!')
                        res.redirect('back');

                    })
                }
                else{
                    req.flash('error', 'invalid or expired session please resend reset password link again.')
                    res.redirect('back');
                }
            });
        }
    });
}

