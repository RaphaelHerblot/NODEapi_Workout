/* 
Imports
*/
    // Modules
    require('dotenv').config();
    const express = require('express');
    const bodyParser = require('body-parser');
    const ejs = require('ejs');
    const path = require('path');
    const MONGOclass = require('./services/mongo.class');
//

/* 
Declarations
*/
    const server = express();
    const port = process.env.PORT;
//


/* 
Server class
*/
    class ServerClass{
        constructor(){
            this.MONGO = new MONGOclass;
        }

        init(){
           // View engine configuration
            server.engine( 'html', ejs.renderFile );
            server.set( 'view engine', 'html' );

            // Static path configuration
            server.set( 'views', __dirname + '/www' );
            server.use( express.static(path.join(__dirname, 'www')) );

            //=> Body-parser
            server.use(bodyParser.json({limit: '10mb'}));
            server.use(bodyParser.urlencoded({ extended: true }));

            // Start server configuration
            this.config();
        };

        config(){
            // Set auth router
            const AuthRouterClass = require('./routers/auth.router');
            const authRouter = new AuthRouterClass();
            server.use('/api', authRouter.init());

            // Set exercise router
            const ExerciseRouterClass = require('./routers/exercise.router');
            const exerciseRouter = new ExerciseRouterClass();
            server.use('/api', exerciseRouter.init());

            // Set workout router
            const WorkoutRouterClass = require('./routers/workout.router');
            const workoutRouter = new WorkoutRouterClass();
            server.use('/api', workoutRouter.init());

            // Set workout router
            const FavoriteRouterClass = require('./routers/favorite.router');
            const favoriteRouter = new FavoriteRouterClass();
            server.use('/api', favoriteRouter.init());
        
            // Set front router
            server.get('/*',  (req, res) => res.render('index') );
        
            // Launch server
            this.launch();
        };
        
        launch(){
            // Connect MongoDB
            this.MONGO.connectDb()
            .then( db => {
                // Start server
                server.listen(port, () => {
                    console.log({
                        node: `http://localhost:${port}`,
                        mongo: db.url
                    });
                });
            })
            .catch( dbErr => console.log('MongoDB Error', dbErr));
        };
    }
//

/* 
Start server
*/
    const NODEapi = new ServerClass();
    NODEapi.init();
//