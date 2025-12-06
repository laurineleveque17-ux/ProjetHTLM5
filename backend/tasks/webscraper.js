const axios = require('axios');
const cheerio = require('cheerio');
const { table } = require('table');

const url = 'https://www.numerama.com/pop-culture/2134305-world-of-warcraft-promis-blizzard-nabandonnera-pas-le-housing-a-la-prochaine-extension.html';

async function scraper(url){
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
        });
        const $ = cheerio.load(data);
        
        let texteIntegral = '';
        const $body = $('body'); 

        // EXCLUSION
        $body.find('header, footer, aside, nav, script, style, span').remove();
        $body.find('#comments, .social-share, .related-articles').remove();
        $body.find('.newsletter-box, .newsletter-signup, .subscribe-form, #email-signup, .newsletter-widget, .form-container').remove();

        const paragraphs = $body.find('p');
        let articleContent = [];

        paragraphs.each((index, element) => {
            const text = $(element).text().trim();

            if (text.length > 30 && 
                !text.toLowerCase().includes('commentaires') && 
                !text.toLowerCase().includes('publié par') &&
                !text.toLowerCase().includes('newsletter') &&
                !text.toLowerCase().includes('loi du 06/01/1978') &&
                !text.toLowerCase().includes('J’accepte tout')
               ) {
                
                articleContent.push(text);
            }
        });
        
        texteIntegral = articleContent.join('\n\n');

        let results = [];
        results.push(['Index', 'article']);

        articleContent.forEach((text, index) => {
             results.push([index + 1, text]);
        });

        console.log(table(results));
        const titreNettoye = $('title').text().replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
        const fileName = `article_${titreNettoye}.txt`;
        
        
        return texteIntegral;

    } catch (error) {
        console.error('Erreur pendant le scraping :', error.message);
        return null;
    }
}

scraper(url);