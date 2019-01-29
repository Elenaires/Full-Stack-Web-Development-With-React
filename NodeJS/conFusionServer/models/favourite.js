const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*const dishSchema = new Schema({
    dishId: {
        type: String
    }
});*/

const favouriteSchema = new Schema({
    user: {
        // using mongoose population to populate author
        // from 'User'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {
    timestamps: true
});

var Favourites = mongoose.model('Favourite', favouriteSchema);
module.exports = Favourites;