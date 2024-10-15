const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


async function searchMeal(req, res){
    // TODO: Update prompt to specify a more specific output format, and set up handling of bad model output
    const input = req.body.meal;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // 4o mini api is way cheaper than 3.5t and should be more capable
            messages: [
                //{ role: "system", content: "You can put a system prompt here if you want" },
                {
                    role: "user",
                    content: `Give me a detailed recipe for making ${input}, including a list of ingredients and instructions.`,
                },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });
        const recipe = response.choices[0].message.content;
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