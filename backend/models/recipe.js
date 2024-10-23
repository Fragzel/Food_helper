const mongoose = require('mongoose');

const RecipeSchema = mongoose.Schema({

  id_recipe_tasty: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  prep_time_minutes: { type: Number, required: false, default: null },
  cook_time: { type: Number, required: false, default: null },
  total_time: { type: Number, required: false, default: null },
  num_servings: { type: Number, required: true, default: null },
  price: {
    total: { type: Number, required: true, default: null },
    portion: { type: Number, required: true, default: null }
  },

});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;