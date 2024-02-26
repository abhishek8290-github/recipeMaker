const Recipe = require('../db/recipes');
const handleAsync = require('../utils/catchAsync');
const logger = require('../middleware/logger');
const makeRecipe_Service = require('../services/openai').makeRecipe;
const fetch_image_Service = require('../services/openai').fetch_image;
const is_valid_recipe = require('../services/openai').is_valid_recipe;
const {shorten_image,get_image_data } = require('../services/image_service'); // should return path 
const {upload_to_bucket} = require('../services/google_services'); 
const User = require('../db/users');

const makeRecipe = handleAsync(async (req, res) => {
    user_id = req.user_id
    dish = req.body.text
    if (!(await is_valid_recipe(dish))) throw new Error('The recipe you entered seems to be incorrect. Please check your input and try again.');
    
    const [recipe , imgurl] = await Promise.all([makeRecipe_Service(dish), fetch_image_Service(dish)])
    recipe.imgurl = imgurl
    if (!recipe) throw new Error('Recipe not found');
    const recipe_db_entry = new Recipe({
        user_id,
        ...recipe
    })
    const db_recipe = await recipe_db_entry.save()
    recipe.recipe_id = db_recipe._id
    save_data_to_db(recipe)
    return recipe
})

const save_data_to_db = async ( recipe  ) => {
    const imgurl_openai = recipe.imgurl

    const {buffer, fileExtension} = await get_image_data(imgurl_openai);

    const bucket_result_openai =  await upload_to_bucket(buffer, fileExtension);

    const bucket_result_short_img = await upload_to_bucket(await shorten_image(buffer), fileExtension);

    const recipe_db = await Recipe.findById(recipe.recipe_id);

    recipe_db.imgurl = bucket_result_openai.signedUrl;
    recipe_db.img_address = bucket_result_openai.destination;
    recipe_db.short_imgurl = bucket_result_short_img.signedUrl;
    recipe_db.short_img_address = bucket_result_short_img.destination;
    
    await recipe_db.save()
    logger.log('Recipe saved to db')

}

const getRecentRecipe = handleAsync(async (req, res) => {

    const dummy_user = !req.user_id || req.user_id === '65bd3671933fc60ac57f25d3'

    const recipes = dummy_user ? await Recipe.find({}).sort({ createdAt: -1 }) : await Recipe.find({user_id: req.user_id}).sort({ createdAt: -1 });
    
    // await Recipe.find({}).sort({ createdAt: -1 });

    // if (!req.user_id || req.user_id === '65bd3671933fc60ac57f25d3') {
    //     const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    //     return recipes || [];
    // }
    // const recipes = await Recipe.find({user_id: req.user_id}).sort({ createdAt: -1 });
    return recipes || [];
})

const getFavoriteRecipe = handleAsync(async (req, res) => {
    const user = await User.findById(req.user_id);
    const  Recipes = await Recipe.find({ _id: { $in: user.favorites } }).sort({ createdAt: -1 });
    return Recipes || [];
})
const getRecipe = handleAsync(async (req, res) => {
    const recipe = await Recipe.findById(req.query.recipe_id);
    return recipe || {};
})

const addToFavorites = handleAsync(async (req, res) => {

    const [user, recipe] = await Promise.all([User.findById(req.user_id), Recipe.findById(req.body.recipe_id)]);
    logger.log(user.favorites)
    if (!recipe) throw new Error('Recipe not found');
    if (!(req.body.recipe_id in user.favorites)) {
        user.favorites.push(req.body.recipe_id);
        await user.save();
    }
    
    return recipe || {};
})




const default_res = {
    "ingredients": [
        {
            "name": "mutton",
            "unit": "grams",
            "quantity": "500"
        },
        {
            "name": "onion",
            "unit": "medium",
            "quantity": "2"
        },
        {
            "name": "garlic",
            "unit": "cloves",
            "quantity": "4"
        },
        {
            "name": "ginger",
            "unit": "inch",
            "quantity": "1"
        },
        {
            "name": "green chilies",
            "unit": "count",
            "quantity": "2"
        },
        {
            "name": "turmeric powder",
            "unit": "teaspoon",
            "quantity": "1"
        },
        {
            "name": "red chili powder",
            "unit": "teaspoon",
            "quantity": "1"
        },
        {
            "name": "coriander powder",
            "unit": "teaspoon",
            "quantity": "1"
        },
        {
            "name": "cumin powder",
            "unit": "teaspoon",
            "quantity": "1"
        },
        {
            "name": "garam masala",
            "unit": "teaspoon",
            "quantity": "1"
        },
        {
            "name": "salt",
            "unit": "teaspoon",
            "quantity": "1"
        },
        {
            "name": "water",
            "unit": "cups",
            "quantity": "2"
        },
        {
            "name": "oil",
            "unit": "tablespoons",
            "quantity": "2"
        },
        {
            "name": "eggs",
            "unit": "count",
            "quantity": "4"
        }
    ],
    "method": [
        {
            "step": "Step 1",
            "instruction": "Heat oil in a pressure cooker."
        },
        {
            "step": "Step 2",
            "instruction": "Add chopped onions, garlic, ginger, and green chilies. Saute until the onions turn golden brown."
        },
        {
            "step": "Step 3",
            "instruction": "Add mutton pieces to the cooker and cook until they are browned on all sides."
        },
        {
            "step": "Step 4",
            "instruction": "Add turmeric powder, red chili powder, coriander powder, cumin powder, garam masala, and salt. Mix well."
        },
        {
            "step": "Step 5",
            "instruction": "Add water to the cooker and close the lid. Cook on high pressure for about 20 minutes."
        },
        {
            "step": "Step 6",
            "instruction": "Release the pressure and open the lid. Check if the mutton is cooked to your liking."
        },
        {
            "step": "Step 7",
            "instruction": "In a separate pan, heat oil and fry the eggs until the whites are set and the yolks are still runny."
        },
        {
            "step": "Step 8",
            "instruction": "Serve the mutton stew in bowls and place a fried egg on top of each bowl."
        }
    ],
    "cooking_time": "40",
    "recipe_name": "Mutton Stew with Eggs on Top",
    "number_of_servings": "4",
    "nutritional_value": "Unknown",
    "taste": "Spicy and flavorful",
    "imgurl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-H6RvK5h1LfF7olqVAuKWLmiM/user-0ix7QQvhh7GssgoJ40MFPwvD/img-1qGdglRJ4nwgCxrx2kUEfw5w.png?st=2024-02-02T16%3A52%3A15Z&se=2024-02-02T18%3A52%3A15Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-01T22%3A38%3A56Z&ske=2024-02-02T22%3A38%3A56Z&sks=b&skv=2021-08-06&sig=S3DEYEimf8n2OFaiCkua00mMOKBrDwvffoPlBMM0dOg%3D",
    "recipe_id": "65bd2bcf9b8eae58f272cedf",
    "success": true
}

module.exports = {
    makeRecipe, getRecentRecipe, getFavoriteRecipe , getRecipe , addToFavorites
}