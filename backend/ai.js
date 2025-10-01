require('dotenv').config();

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page. Make sure you bold important things like the dish name and other important headers. Don't include hyperlinks of any sort.
`;

async function getRecipe(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");

    const payload = {
        model: "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
        ],
        max_tokens: 1024,
    };

    try {
        const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.choices && result.choices.length > 0) {
            return result.choices[0].message.content;
        } else {
            throw new Error("No choices returned from Hugging Face API");
        }

    } catch (err) {
        console.error("Error querying Hugging Face:", err.message);
        return null;
    }
}

module.exports = getRecipe;
