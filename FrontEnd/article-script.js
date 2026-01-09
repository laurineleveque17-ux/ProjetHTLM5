/* =============================================================
   GESTION DE LA PAGE DÉTAIL (article-script.js)
   ============================================================= */

// 1. Récupération globale de l'ID de l'article dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('id');

// 2. Chargement initial des données au démarrage de la page
document.addEventListener('DOMContentLoaded', async () => {
    console.log("ID de l'article à charger :", articleId);

    if (!articleId) {
        document.getElementById('article-title').textContent = "Erreur : Aucun article sélectionné";
        return;
    }

    try {
        // Récupération des détails de l'article depuis l'API
        const response = await fetch(`http://localhost:5000/api/articles/${articleId}`);
        const article = await response.json();

        if (response.ok) {
            // Remplissage des éléments HTML
            document.getElementById('article-title').textContent = article.title;
            
            const resumeContent = article.resume || article.content || "Aucun résumé disponible pour cet article.";
            document.getElementById('summary-text').textContent = resumeContent;

            // Affichage des compteurs de réactions existants
            document.getElementById('like-count').textContent = article.reaction_count || 0;
            document.getElementById('dislike-count').textContent = article.dislike_count || 0;

            // Affichage des commentaires déjà présents
            if (article.comments && article.comments.length > 0) {
                displayComments(article.comments);
            }

            // Configuration du bouton vers la source originale
            const sourceBtn = document.getElementById('source-link');
            if (article.url_originale) {
                sourceBtn.onclick = () => window.open(article.url_originale, '_blank');
            }
        } else {
            document.getElementById('article-title').textContent = "Article introuvable.";
        }
    } catch (error) {
        console.error("Erreur lors du chargement initial :", error);
        document.getElementById('article-title').textContent = "Erreur de connexion au serveur.";
    }

    // --- LIAISON DES ÉVÉNEMENTS (BOUTONS ET FORMULAIRE) ---

    // Bouton Like
    document.getElementById('like-btn').onclick = () => sendReaction('like');

    // Bouton Dislike
    document.getElementById('dislike-btn').onclick = () => sendReaction('dislike');

    // Formulaire de commentaire
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.onsubmit = async (e) => {
            e.preventDefault(); // 🔥 EMPÊCHE LE RECHARGEMENT DE LA PAGE
            
            const input = document.getElementById('comment-input');
            const text = input.value;

            if (!text.trim()) return;

            try {
                const response = await fetch(`http://localhost:5000/api/articles/${articleId}/comment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text })
                });

                if (response.ok) {
                    const updatedComments = await response.json();
                    displayComments(updatedComments); // Met à jour la liste sans recharger
                    input.value = ''; // Vide le champ
                } else {
                    alert("Erreur lors de l'envoi du commentaire.");
                }
            } catch (err) {
                console.error("Erreur lors de l'envoi :", err);
            }
        };
    }
});

// 3. Fonction pour envoyer une réaction (Like/Dislike)
async function sendReaction(type) {
    try {
        const response = await fetch(`http://localhost:5000/api/articles/${articleId}/react`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: type })
        });
        
        const data = await response.json();

        if (response.ok) {
            document.getElementById('like-count').textContent = data.likes;
            document.getElementById('dislike-count').textContent = data.dislikes;
        }
    } catch (error) {
        console.error("Erreur réaction :", error);
    }
}

// 4. Fonction pour afficher la liste des commentaires
function displayComments(comments) {
    const list = document.getElementById('comments-list');
    list.innerHTML = ''; // On vide pour éviter les doublons

    comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.style.borderBottom = "1px solid #eee";
        div.style.padding = "10px 0";
        
        const dateStr = c.date ? new Date(c.date).toLocaleString('fr-FR') : "Date inconnue";
        
        div.innerHTML = `
            <p style="margin: 0; color: #333;">${c.text}</p>
            <small style="color: #888;">Posté le ${dateStr}</small>
        `;
        list.appendChild(div);
    });
}