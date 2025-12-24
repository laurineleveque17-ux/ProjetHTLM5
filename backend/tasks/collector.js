const scraper = require('./webscraper.js');
const summarizeArticle = require('./summarizer.js');
const cron = require('node-cron');
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
const ArticleModel = require('../models/Article');

const rootPath = path.resolve(__dirname, '..', '.env'); 
require('dotenv').config({ path: rootPath });

const MONGO_URI = process.env.MONGO_URI; 
const GNEWS_API_URL = process.env.GNEWS_API_URL;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

async function search_articles() {

    await ArticleModel.deleteMany({});
    try{
        console.log('Trying to search some articles...');
        const gnewsResponse = await axios.get(GNEWS_API_URL, {
            params: {
                token: GNEWS_API_KEY,
                lang: 'fr',
                q: 'monde',
                max: 10,
                in: 'title,content',
                sortby: 'publishedAt'
            }
        });
        const gnewsArticles = gnewsResponse.data.articles;
        console.log('Articles retrieved successfully:');
        try{
            for (const article of gnewsArticles) {
            
                const content = await scraper(article.url);
                if(content != null){
                    const newArticle = ArticleModel({
                        title: article.title,
                        resume: await summarizeArticle(content),
                        content: content,
                        url_originale: article.url,
                        source_nom: article.source.name,
                        date_publication: new Date(article.publishedAt),
                        reaction_count: 0
                    });
                    await newArticle.save();
                }
                else{
                    const newArticle = ArticleModel({
                        title: article.title,
                        resume: "Résumé indisponible en raison d'un échec du scraping.",
                        content: article.content,
                        url_originale: article.url,
                        source_nom: article.source.name,
                        date_publication: new Date(article.publishedAt),
                        reaction_count: 0
                    });
                    await newArticle.save();
                }
            }
            
        }
        catch(error){console.error('Erreur dans la sauvegarde dans la base de donnée.',error);}
    }
    catch (error) {
        console.error('Error fetching articles:', error);
    }
    finally {
        console.log('Processus terminé.');
    }
}

module.exports = search_articles;

