const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: "Say hello",
                },
            ],
        });

        console.log("SUCCESS:");
        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error("OPENAI TEST ERROR:");
        console.error(error);
        console.error("MESSAGE:", error.message);
    }
}

test();