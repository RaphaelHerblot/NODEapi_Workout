/*
Imports
*/
const express = require('express');
const router = express.Router();
const FavoriteModel = require('../models/favorite.schema');
//

/*
Routes definition
*/
class FavoriteRouterClass {
    constructor() {
    }
    
    // Set route fonctions
    routes(){
 
       // Create one item
       router.post('/favorite/create', (req, res) => {
            FavoriteModel.create(req.body)
            .then( document => res.status(201).json({
                method: 'POST',
                route: `/api/favorite/create`,
                data: document,
                error: null,
                status: 201
            }))
            .catch( err => res.status(502).json({
                method: 'POST',
                route: `/api/favorite/create`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Read all the favorites workout of an user
        router.get('/favorite/find/:user', (req, res) => {
            FavoriteModel.find({user: req.params.user}).populate("workout")
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/favorite/find/${req.params.user}`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/favorite/find/${req.params.user}`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Read one the favorite workout of an user
        router.get('/favorite/find/:user/:workout', (req, res) => {
            FavoriteModel.find({user: req.params.user, workout: req.params.workout})
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/favorite/find/${req.params.user}/${req.params.workout}`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/favorite/find/${req.params.user}/${req.params.workout}`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Read one the favorite workout of an user
        router.get('/favorite/find/:user/workout', (req, res) => {
            FavoriteModel.find({user: req.params.user}).populate("workout")
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/favorite/find/${req.params.user}/workout`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/favorite/find/${req.params.user}/workout`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Delete a favorite workout
        router.delete('/favorite/delete/:id', (req, res) => {
            FavoriteModel.findOneAndDelete({ _id: req.params.id })
            .then( deletedDocument => res.status(200).json({
                    method: 'DELETE',
                    route: `/api/favorite/delete/${req.params.id}`,
                    data: deletedDocument,
                    error: null,
                    status: 200
            }))
            .catch( err => res.status(404).json({
                method: 'DELETE',
                route: `/api/favorite/delete/${req.params.id}`,
                data: null,
                error: err,
                status: 404
            }));
        });

         // Read all the favorites
         router.get('/favorite/find/all', (req, res) => {
            FavoriteModel.find()
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/favorite/find/all`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/favorite/find/all`,
                data: null,
                error: err,
                status: 502
            }));
        });
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
    module.exports = FavoriteRouterClass;
//