/*
Imports
*/
const express = require('express');
const router = express.Router();
const WorkoutModel = require('../models/workout.schema');
//

/*
Routes definition
*/
class WorkoutRouterClass {
    constructor() {
    }
    
    // Set route fonctions
    routes(){

        // Create a workout
        router.post('/workout/create', (req, res) => {
            WorkoutModel.create(req.body)
            .then( document => res.status(201).json({
                method: 'POST',
                route: `/api/workout/create`,
                data: document,
                error: null,
                status: 201
            }))
            .catch( err => res.status(502).json({
                method: 'POST',
                route: `/api/workout/create`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Read all Workouts
        router.get('/workout/find/all', (req, res) => {
            WorkoutModel.find().sort({title: 'asc'}).limit( 3 )
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/workout/find/all`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/workout/find/all`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Update the number of favorite
        router.put('/workout/update/favorite/:id', (req, res) => {
            WorkoutModel.findById({_id: req.params.id})
            .then( document => {
                // Update document
                document.nbFavorite = req.body.nbFavorite;
                
                // Save document
                document.save()
                .then( updatedDocument => res.status(200).json({
                    method: 'PUT',
                    route: `/api/workout/update/favorite/${req.params.id}`,
                    data: updatedDocument,
                    error: null,
                    status: 200
                }))
                .catch( err => res.status(502).json({
                    method: 'PUT',
                    route: `/api/workout/update/favorite/${req.params.id}`,
                    data: null,
                    error: err,
                    status: 502
                }));
            })
            .catch( err => res.status(404).json({
                method: 'PUT',
                route: `/api/${req.params.endpoint}/${req.params.id}`,
                data: null,
                error: err,
                status: 404
            }));
        });

        // Read one MongoDB document
        router.get('/workout/find/:name/exercise', (req, res) => {
            WorkoutModel.find({title: req.params.name}).populate("exercises")
            .then( document => res.status(200).json({
                method: 'GET',
                route: `/api/workout/find/${req.params.name}/exercise`,
                data: document,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/workout/find/${req.params.name}/exercise`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Read the user workouts
        router.get('/workout/find/:creator', (req, res) => {
            WorkoutModel.find({creator: req.params.creator}).sort({dateCreation: 'desc'})
            .then( document => res.status(200).json({
                method: 'GET',
                route: `/api/workout/find/${req.params.creator}`,
                data: document,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/workout/find/${req.params.creator}`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Read one workout by its ID
        router.get('/workout/find/id/:id', (req, res) => {
            WorkoutModel.find({_id: req.params.id})
            .then( document => res.status(200).json({
                method: 'GET',
                route: `/api/workout/find/id/${req.params.id}`,
                data: document,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/workout/find/id/${req.params.id}`,
                data: null,
                error: err,
                status: 502
            }));
        });


        // Update a workout
        router.put('/workout/update/:id', (req, res) => {
            WorkoutModel.findById({_id: req.params.id})
            .then( document => {
                // Update document
                document.title = req.body.title;
                document.description = req.body.description;
                document.goal = req.body.goal;
                document.duration = req.body.duration;
                document.muscle = req.body.muscle;
                document.equipement = req.body.equipement;
                document.exercises = req.body.exercises;
                document.nbSerie = req.body.nbSerie;

                // Save document
                document.save()
                .then( updatedDocument => res.status(200).json({
                    method: 'PUT',
                    route: `/api/workout/update/${req.params.id}`,
                    data: updatedDocument,
                    error: null,
                    status: 200
                }))
                .catch( err => res.status(502).json({
                    method: 'PUT',
                    route: `/api/workout/update/${req.params.id}`,
                    data: null,
                    error: err,
                    status: 502
                }));
            })
            .catch( err => res.status(404).json({
                method: 'PUT',
                route: `/api/${req.params.endpoint}/${req.params.id}`,
                data: null,
                error: err,
                status: 404
            }));
        });

        // Search Workout by title
        router.get('/workout/find/title/:title', (req, res) => {
            WorkoutModel.find({title: { $regex : `.*${req.params.title}.*`}})
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/workout/find/title/${req.params.title}`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/workout/find/title/${req.params.title}`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Search Workout by description
        router.get('/workout/find/description/:description', (req, res) => {
            WorkoutModel.find({description: { $regex : `.*${req.params.description}.*`}})
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/workout/find/description/${req.params.description}`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/workout/find/description/${req.params.title}`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Search Workout by goal
        router.get('/workout/find/goal/:goal', (req, res) => {
            WorkoutModel.find({goal: { $regex : `.*${req.params.goal}.*`}})
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/workout/find/goal/${req.params.goal}`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/workout/find/goal/${req.params.goal}`,
                data: null,
                error: err,
                status: 502
            }));
        });

        // Search Workout by muscle
        router.get('/workout/find/muscle/:muscle', (req, res) => {
            WorkoutModel.find({muscle: { $regex : `.*${req.params.muscle}.*`}})
            .then( documents => res.status(200).json({
                method: 'GET',
                route: `/api/workout/find/muscle/${req.params.muscle}`,
                data: documents,
                error: null,
                status: 200
            }))
            .catch( err => res.status(502).json({
                method: 'GET',
                route: `/api/workout/find/muscle/${req.params.muscle}`,
                data: null,
                error: err,
                status: 502
            }));
        });

         // Delete a Workout
         router.delete('/workout/delete/:id', (req, res) => {
            WorkoutModel.findOneAndDelete({ _id: req.params.id })
            .then( deletedDocument => res.status(200).json({
                    method: 'DELETE',
                    route: `/api/workout/delete/${req.params.id}`,
                    data: deletedDocument,
                    error: null,
                    status: 200
            }))
            .catch( err => res.status(404).json({
                method: 'DELETE',
                route: `/api/workout/delete/${req.params.id}`,
                data: null,
                error: err,
                status: 404
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
    module.exports = WorkoutRouterClass;
//