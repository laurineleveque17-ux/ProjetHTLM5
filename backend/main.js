const app = require('./server');
const search_articles = require('./tasks/collector');
const cron = require('node-cron');
const connectDB = require('./db');
const ArticleModel = require('./models/Article'); 
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    // 1. Lancement du serveur
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
    

    // 2. Lancement du Cron
    console.log("Scraper activé");
    cron.schedule('*/30 * * * *', async () => {
        await ArticleModel.deleteMany({});
        try {
            await search_articles('monde');
            await sleep(3000);  // Attendre pour ne pas surcharger GNEWS et axios.
            await search_articles('Technology');
            await sleep(3000);
            await search_articles('Entertainment');
            await sleep(3000);
            await search_articles('Sports');
            await sleep(3000);
            await search_articles('Geopolitics');
            await sleep(3000);
            await search_articles('Health');
            setTimeout(() => {
                alert("Les articles seront mis à jour dans 5 minutes.");
            }, 25 * 60 * 1000)
        } catch (err) {
            console.error("Erreur lors du cron :", err);
        }
    });

    await search_articles('monde');
    await sleep(3000);
    await search_articles('Geopolitics');
    await sleep(3000);
    await search_articles('Health');
    await sleep(3000);
    await search_articles('Technology');
    await sleep(3000);
    await search_articles('Entertainment');
    await sleep(3000);
    await search_articles('Sports');
    

}

main();