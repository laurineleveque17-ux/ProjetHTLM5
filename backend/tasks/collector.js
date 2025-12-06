import scraper from './webscraper.js';

const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');

const rootPath = path.resolve(__dirname, '..', '.env'); 
require('dotenv').config({ path: rootPath });

const MONGO_URI = process.env.MONGO_URI; 
const GNEWS_API_URL = process.env.GNEWS_API_URL;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

const ArticleSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
    },
    resume: {
        type: String,
        required: false
    },
    content:{
        type: String,
        required: true
    },
    url_originale: {
        type: String,
        required: true,
        unique: true,
    },
    source_nom: {
        type: String,
    },
    date_publication: {
        type: Date,
        required: true,
    },
    reaction_count: {
        type: Number,
        default: 0
    }
}, { timestamps: true }); 

const ArticleModel = mongoose.model('Article', ArticleSchema);

async function search_articles() {

    await mongoose.connect(MONGO_URI);
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
            const newArticle = ArticleModel({
                title: article.title,
                content: article.content,
                url_originale: article.url,
                source_nom: article.source.name,
                date_publication: new Date(article.publishedAt),
                reaction_count: 0
            });
            await newArticle.save();
        }}
        catch(error){console.error('Erreur dans la sauvegarde dans la base de donnée.',error);}
    }
    catch (error) {
        console.error('Error fetching articles:', error);
    }
}

search_articles();