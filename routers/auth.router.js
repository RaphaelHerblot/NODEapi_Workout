/*
Imports
*/
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const UserModel = require('../models/user.schema');
//

/*
Routes definition
*/
class AuthRouterClass {
    constructor() {
    }
    
    // Set route fonctions
    routes(){
        /* 
        AUTH: Register 
        */
       router.post('/auth/register', (req, res) => {
        // Encrypt user password
        bcrypt.hash( req.body.password, 10 )
        .then( hashedPassword => {
            // Change user password
            req.body.password = hashedPassword;
            
            // Save user data
            UserModel.create(req.body)
            .then( document => res.status(201).json({
                method: 'POST',
                route: `/api/auth/register`,
                data: document,
                error: null,
                status: 201
            }))
            .catch( err => res.status(502).json({
                method: 'POST',
                route: `/api/auth/register`,
                data: null,
                error: err,
                status: 502
            }));
        })
        .catch( hashError => res.status(500).json({
            method: 'POST',
            route: `/api/auth/register`,
            data: null,
            error: hashError,
            status: 500
        }));
    });
        //

        /* 
        AUTH: Login 
        */
            router.post('/auth/login', (req, res) => {
                // Get user from email
                console.log("WHOOOOOOOOOOOOOOOOOOO")
                UserModel.findOne({ email: req.body.email }, (err, user) => {
                    if(err){
                        return res.status(500).json({
                            method: 'POST',
                            route: `/api/auth/login`,
                            data: null,
                            error: err,
                            status: 500
                        });
                    }
                    else{
                        // Check user password
                        const validPassword = bcrypt.compareSync(req.body.password, user.password);
                        if( !validPassword ){
                            return res.status(500).json({
                                method: 'POST',
                                route: `/api/auth/login`,
                                data: null,
                                error: 'Invalid password',
                                status: 500
                            });
                        }
                        else{
                            const token = jwt.sign(
                                { userId: user._id },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' });
                            return res.status(201).json({
                                method: 'POST',
                                route: `/api/auth/login`,
                                data: user,
                                userId: user._id,
                                token: token,
                                error: null,
                                status: 201
                            });
                        };
                    };
                });
            });

        // Check token
            router.post('/auth/me', (req, res) => {
                // Get user from email
                console.log("TOKEN CHECK")
               
                var decoded = jwtDecode(req.body.token);
                console.log(decoded);
                console.log("TOKEN CHECK")
                var userId = decoded.userId;
                
                UserModel.findOne({ _id: userId }, (err, user) => {
                    if(err){
                        return res.status(500).json({
                            method: 'POST',
                            route: `/api/auth/me`,
                            data: null,
                            error: err,
                            status: 500
                        });
                    }
                    else{
                        return res.status(201).json({
                            method: 'POST',
                            route: `/api/auth/me`,
                            data: user,
                            error: null,
                            status: 201
                        });
                    };
                });
            });
        //

        //  // Disconnect the current user
        //  router.get('/auth/logout', (req, res) => {
        //      if(localStorage)
        //     // UserModel.findById(req.params.id)
        //     // .then( document => res.status(200).json({
        //     //     method: 'GET',
        //     //     route: `/api/auth/logout`,
        //     //     data: document,
        //     //     error: null,
        //     //     status: 200
        //     // }))
        //     // .catch( err => res.status(502).json({
        //     //     method: 'GET',
        //     //     route: `/api/auth/logout`,
        //     //     data: null,
        //     //     error: err,
        //     //     status: 502
        //     // }));
        //     // console.log(req)
        //     // console.log('req.params.id')
        // });
    }

    // Start router
    init(){
        // Get route fonctions
        this.routes();

        // Sendback router
        return router;
    };
};
//

/*
Export
*/
module.exports = AuthRouterClass;
//