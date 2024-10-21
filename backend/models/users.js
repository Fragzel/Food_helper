const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true },
    likedRecipes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }], required: true, default: [] },
    id_tasty_recipes: { type: [Number], default: [] }
});

const User = mongoose.model('users', userSchema);

module.exports = User;