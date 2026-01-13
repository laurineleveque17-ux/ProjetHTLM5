// backend/index.js

const app = require('./server'); // Cherche server.js dans le même dossier
const search_articles = require('./tasks/collector');
const cron = require('node-cron');
const connectDB = require('./db');
const ArticleModel = require('./models/Article'); 

async function main() {
    // 1. Connexion à la base de données
    await connectDB();

    // 2. Lancement du serveur
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });

    // 3. Lancement du Cron
    console.log("Scraper activé");
    cron.schedule('*/10 * * * *', async () => {
        await ArticleModel.deleteMany({});
        try {
            await search_articles('monde');
            await search_articles('technologie');
            await search_articles('culture');
            await search_articles('sports');
            await search_articles('geopolitique');
            await search_articles('sante');
        } catch (err) {
            console.error("Erreur lors du cron :", err);
        }
    });

    await ArticleModel.deleteMany({});
    await search_articles('monde');
    await search_articles('technologie');
    await search_articles('culture');
    await search_articles('sports');
    await search_articles('geopolitique');
    await search_articles('sante');
    

}

main();