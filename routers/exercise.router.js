/*
Imports
*/
const express = require('express');
const router = express.Router();
const ExerciseModel = require('../models/exercise.schema');
//

/*
Routes definition
*/
class ExerciseRouterClass {
    constructor() {
    }
    
    // Set route fonctions
    routes(){
        // Create one item
        router.post('/exercise/create', (req, res) => {
            ExerciseModel.create(req.body)
            .then( document => res.status(201).json({
                method: 'POST',
                route: `/api/exercise/create`,
                data: document,
                error: null,
                status: 201
            }))
            .catch( err => res.status(502).json({
                method: 'POST',
                route: `/api/exercise/create`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Read all exercise documents
        router.get('/exercise/find/all', (req, res) => {
            ExerciseModel.find()
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/exercise/find/all`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/exercise/find/all`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Read one MongoDB document
        router.get('/exercise/find/:id', (req, res) => {
            ExerciseModel.findById({_id: req.params.id})
            .then( document => res.status(200).json({
                method: 'GET',
                route: `/api/exercise/find/${req.params.id}`,
                data: document,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/exercise/find/${req.params.id}`,
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
module.exports = ExerciseRouterClass;
//