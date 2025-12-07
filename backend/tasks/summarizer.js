const { OpenAI } = require('openai');
const path = require('path');

const rootPath = path.resolve(__dirname, '..', '.env'); 
require('dotenv').config({ path: rootPath });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

async function summarizeArticle(text) {
    try{
        const resp = await openaiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant that summarizes French news articles into concise summaries." },
                { role: "user", content: `Please provide a concise summary of the following French press article that can be read in 2 to 3 minutes:\n\n${text}` }],
            temperature: 0.2,
            max_tokens: 300,
        });
        return resp.choices[0].message.content.trim();
        }
    catch (error) {
        console.log("Erreur lors de la création du résumé: ", error.message);
        return null;
    }   
}

module.exports = summarizeArticle;
