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
    workout : {
        type: Schema.Types.ObjectId,
        ref: "workout"
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
});
//

/*
Export
*/
    const MyModel = mongoose.model('favorite', MySchema);
    module.exports = MyModel;
//