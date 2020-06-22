/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//


/*
Definition
*/
const MySchema = new Schema({
    title: String,
    description: String,
    muscle: String,
    image: String
});
//

/*
Export
*/
    const MyModel = mongoose.model('exercise', MySchema);
    module.exports = MyModel;
//