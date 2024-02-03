const OpenAI =  require('openai')
require('dotenv').config(); 

const openai = new OpenAI({apiKey : process.env.OPENAI_API_KEY });
// const recipe_schema = require('./recipe_schema.js').recipe_schema
const recipe_schema = {
    type:"object",
    properties: {
      answer:{
        type: "integer",
        description: "Tells the probibility of the dish being cooked and eaten by civilized people between 0 to 100",
      },
    },
    required : ["answer"]
  }


const is_valid_recipe = async(recipe) => {

    const model = "gpt-3.5-turbo-0613"

    const messages = [
        { role: "user", content: `How to make ${recipe}`}
      ];
    
    const response = await openai.chat.completions.create({
        model: model,
        messages: messages,
        functions:[{
          "name" : "is_valid_recipe",
          "parameters" : {
            type:"object",
            properties: {
              answer:{
                type: "integer",
                description: "Tells the probibility of the dish being cooked and eaten by civilized people between 0 to 100",
              },
            },
            required : ["answer"]
          }
        }],
        function_call : {
          "name" : "is_valid_recipe"
        }
      });

      const responseMessage = response.choices[0]?.message?.function_call?.arguments;
      const answer = JSON.parse(responseMessage)
      return answer.answer > 25

}

is_valid_recipe('aloo paratha with coca cola')



  module.exports = {
    recipe_schema
  }