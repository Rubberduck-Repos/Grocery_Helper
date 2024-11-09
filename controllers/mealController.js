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
                    content: `Please provide a detailed recipe for making ${input}. Use the following format:
                    
                    Ingredients:
                    - List each ingredient clearly with quantity and units.
                
                    Instructions:
                    Step 1: [Brief step name]
                    - [Detailed explanation of what to do]
                    
                    Step 2: [Brief step name]
                    - [Detailed explanation of what to do]
                    
                    Make sure each step has a name followed by a detailed description, and use clear numbering or markers so that the parsing logic is simple.`
                },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });
        const recipe = response.choices[0].message.content;
        // Split recipe into ingredients and instructions
        const ingredientsIndex = recipe.indexOf("Ingredients");
        const instructionsIndex = recipe.indexOf("Instructions");

        let ingredientsText = recipe.substring(ingredientsIndex + 11, instructionsIndex).trim();
        let instructionsText = recipe.substring(instructionsIndex + 12).trim();

        // Parse ingredients into an array of strings
        const ingredients = ingredientsText
            .split(/\n+/) // Split by newline characters
            .map(item => item.replace(/^-/, '').trim()) // Remove leading dashes and trim whitespace
            .filter(item => item); // Filter out any empty strings

        // Parse instructions into two lists: step titles and step details
        const instructionsTitles = [];
        const instructionsDetails = [];

        const instructionSteps = instructionsText.split(/Step \d+:/);

        instructionSteps.forEach(step => {
            if (step.trim()) {
                const firstPeriodIndex = step.indexOf('.');
                if (firstPeriodIndex !== -1) {
                    const stepTitle = step.substring(0, firstPeriodIndex + 1).trim();
                    const stepDetail = step.substring(firstPeriodIndex + 1).trim();
                    instructionsTitles.push(stepTitle);
                    instructionsDetails.push(stepDetail);
                }
            }
        });

        res.render("meal", { mealName: input, ingredients, instructions_titles, instructions_details });

    } catch (error) {
        console.error("Error fetching recipe: ", error);
        res.status(500).send("Error getting recipe");
    }
}

module.exports = {
    searchMeal
}