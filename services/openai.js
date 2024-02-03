const logger = require('../middleware/logger');
const OpenAI =  require('openai')
require('dotenv').config(); 

const openai = new OpenAI({apiKey : process.env.OPENAI_API_KEY });
const recipe_schema = require('./recipe_schema.js').recipe_schema
const RECIPE_PROBABILITY_THRESHOLD = 25 // 25% probability of the dish being cooked and eaten by civilized people


const makeRecipe = async(query) => {
  
  const model = "gpt-3.5-turbo-0613"

  const conversation_data = conversation(query);

  logger.log(conversation_data.messages, 'info' )
  
  const response = await openai.chat.completions.create({
    model: model,
    messages: conversation_data.messages,
    functions:[{
      "name" : "make_json_format",
      "parameters" : conversation_data.schema
    }],
    function_call : {
      "name" : "make_json_format"
    }
  });
  const responseMessage = response.choices[0]?.message?.function_call?.arguments;
  const answer = safeJsonParse(responseMessage)
  return answer
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

async function generateOpenAIResponse(prompt) {
  try {
      
      const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt: prompt
    });
      return response.data.choices[0].text.trim();
  } catch (error) {
      console.error('Error generating response with OpenAI:', error);
      return 'An error occurred while generating the response.';
  }
}




const conversation  =  (recipe = "panner butter masala") => {
  const messages = [
    { role: "user", content: `How to make ${recipe}`}
  ];

  const schema = recipe_schema
  
  return {
    messages , schema 
  }

}


const fetch_image = async(query) => {
  try {
    const prompt = `Create a vibrant and appetizing image of a dish that features a ${query} cuisine. Imagine a [specific dish name] with rich colors and textures, beautifully presented on a [type of plate or surface]. Include elements such as [key ingredients] and garnishes to enhance the visual appeal. Feel free to add creative touches to make the dish visually striking. Consider the lighting to highlight the details and create a visually appealing composition. The goal is to evoke a sense of deliciousness and culinary artistry in the final image.`
    const image = await openai.images.generate({ model: "dall-e-3", prompt:prompt });
    logger.log(image.data);

    imgurl = image.data[0].url

    return imgurl

  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
  }
}

function safeJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null; // Return null or handle the error in an appropriate way
  }
}




module.exports = {
  makeRecipe , fetch_image , is_valid_recipe
}

/*
  const stream = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: `You are a helpful assistant designed to tell
       how to make a specified dish and then extract the relevant data to use as arguments to pass into the given function provided`},
      { role: "system", content: `Please tell me How to make ${recipe_sample} ` },
      get_json_schema(),
      function_call={"name": "story_meta_data"}
    ],
    response_format: { type: "json_object" },
    stream: false,
  });


  {
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
*/