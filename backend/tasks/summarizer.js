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
            { 
                role: "system", 
                content: "Tu es un assistant spécialisé dans le résumé de presse française. Ta mission est de rédiger des résumés clairs, neutres et structurés en français." 
            },
            { 
                role: "user", 
                content: `Analyse le texte suivant et respecte strictement ces consignes :
                    1. Si le texte est vide ou contient une erreur de chargement, réponds uniquement : "Contenu indisponible. Veuillez consulter l'article original via le lien ci-dessous."
                    2. Si le contenu est valide, rédige un résumé en français d'environ 150 à 200 mots (lecture en 2-3 minutes).
                    3. Utilise un ton journalistique.

                    Voici le contenu de l'article :
                    \n\n${text}` 
            }
            ],            
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
