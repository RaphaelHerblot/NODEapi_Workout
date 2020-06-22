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
        name: String,
        email: String,
        password: String
    });
//

/*
Export
*/
    const MyModel = mongoose.model('user', MySchema);
    module.exports = MyModel;
//