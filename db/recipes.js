const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: false },
  unit: { type: String, required: false },
  quantity: { type: String, required: false },
});

const methodStepSchema = new mongoose.Schema({
  step: { type: String, required: false },
  instruction: { type: String, required: false },
});

const recipeSchema = new mongoose.Schema({
  user_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  ingredients: [ingredientSchema],
  method: [methodStepSchema],
  cooking_time: { type: String, required: true },
  recipe_name: { type: String, required: true },
  number_of_servings: { type: String, required: true },
  nutritional_value: { type: String, required: true },
  tips: { type: String },
  taste: { type: String },
  imgurl: { type: String, required: false },
  img_address: { type: String, required: false },
  short_imgurl: { type: String, required: false },
  short_img_address: { type: String, required: false },
  time_taken: { type: String, required: false },
  createdAt: {type: Date, default: Date.now
},
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;


