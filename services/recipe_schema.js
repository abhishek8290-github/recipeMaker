const recipe_schema = {
    type:"object",
    properties: {
      ingredients : {
        type : "array" ,
        description : "List of ingredients required to make the dish with quantity and unit of measurement and name of the ingredient",
        items :{
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the ingredient, eg. cheese, tomato",
            },
            unit: { 
              type: "string", 
              description: "The unit of measurement for the ingredient, eg. cup, teaspoon, pinch",
            },
            quantity: {
              type: "string",
              description: "The quantity of the ingredient, eg. 1, 2, 3",
            }
          }
        }
  
      },
      method : {
        type : "array",
        description : "List of steps required to make the dish",
        items : {
          type : "object",
          properties : {
            step : {
              type : "string",
              description : "The step number of the instruction"
            },
            instruction : {
              type : "string",
              description : "The instruction to be followed in the step"
            }
          }
        }
      },
      cooking_time: {
        type: "string",
        description: "The time required to cook the dish in minutes",
      },
      recipe_name: {
        type: "string",
        description: "The name of the dish",
      },
      number_of_servings: {
        type: "string",
        description: "The number of servings the dish makes",
      },
      tips: {
        type: "string",
        description: "Any tips or tricks to make the dish",
      },
      nutritional_value:{
        type: "string",
        description: "The nutritional value of the dish",
      },
      taste:{
        type: "string",
        description: "The taste of the dish",
      },
    },
    required : ["taste", "ingredients", "method", "number_of_servings" , "recipe_name" , "cooking_time" , "nutritional_value"]
  }


  module.exports = {
    recipe_schema
  }