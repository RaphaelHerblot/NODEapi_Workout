/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//


/*
Definition
*/

ObjectId = Schema.ObjectId;

const MySchema = new Schema({
    title: String,
    description: String,
    goal: String,
    duration: String,
    muscle: String,
    equipement: String,
    nbSerie: { type: Number, default: 1 },
    nbFavorite: { type: Number, default: 0 },
    
    exercises : [{
        exercise: Array,
        howMany: Array
    }],
    creator : {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    dateCreation : { type : Date, default: Date.now }
});
//

/*
Export
*/
    const MyModel = mongoose.model('workout', MySchema);
    module.exports = MyModel;
//