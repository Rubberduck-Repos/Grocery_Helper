const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


async function searchMeal(req, res){
    const input = req.body.meal;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            prompt: `Give me a detailed recipe for making ${input}, including a list of ingredients and instructions.`,
            max_tokens: 500,
            temperature: 0.7,
        });

        const recipe = response.data.choices[0].text;
        // split recipe into ingredients and instructions
        const ingredientsIndex = recipe.indexOf("Ingredients");
        const instructionsIndex = recipe.indexOf("Instructions");

        let ingredients = recipe.substring(ingredientsIndex + 11, instructionsIndex).trim();
        let instructions = recipe.substring(instructionsIndex + 12).trim();
        
        res.render("meal", { mealName: input, ingredients, instructions });

    } catch (error) {
        console.error("Error fetching recipe: ", error);
        res.status(500).send("Error getting recipe");
    }
}

module.exports = {
    searchMeal
}