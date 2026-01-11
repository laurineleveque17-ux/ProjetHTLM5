/* =============================================================
   GESTION DE LA PAGE DÉTAIL (article-script.js)
   ============================================================= */

const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('id');
const token = localStorage.getItem('token');
const BASE_URL = "http://localhost:5000"; // Vérifie si ton serveur est sur 5000 ou 3000 !

// 1. Fonction principale pour charger l'article
async function chargerArticle() {
    console.log("Chargement de l'article :", articleId);

    if (!articleId) {
        document.getElementById('article-title').textContent = "Erreur : Aucun article sélectionné";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/articles/${articleId}`);
        const article = await response.json();

        if (response.ok) {
            // Textes
            document.getElementById('article-title').textContent = article.title;
            document.getElementById('summary-text').textContent = article.resume || article.content || "Aucun résumé.";

            // Compteurs (utilise les noms exacts de ton modèle backend)
            document.getElementById('like-count').textContent = article.reaction_count || article.like || 0;
            document.getElementById('dislike-count').textContent = article.dislike || 0;

            // Commentaires
            if (article.comments) {
                displayComments(article.comments);
            }

            // Source
            const sourceBtn = document.getElementById('source-link');
            if (article.url_originale && sourceBtn) {
                sourceBtn.onclick = () => window.open(article.url_originale, '_blank');
            }

            // Mise à jour visuelle des boutons (couleur)
            majStyleBoutons();

        } else {
            document.getElementById('article-title').textContent = "Article introuvable.";
        }
    } catch (error) {
        console.error("Erreur chargement :", error);
    }
}

// 2. Fonction pour envoyer une réaction
async function envoyerReaction(type) {
    if (!token) {
        alert("Vous devez être connecté pour voter.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/reactions/${articleId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            },
            body: JSON.stringify({ type: type })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.action === 'REMOVED') {
                localStorage.removeItem(`voted_${articleId}`);
            } else {
                localStorage.setItem(`voted_${articleId}`, type);
            }
            chargerArticle(); // On recharge les chiffres
        } else {
            alert(data.msg || "Erreur lors du vote");
        }
    } catch (error) {
        console.error("Erreur réaction:", error);
    }
}

// 3. Mise à jour visuelle des boutons
function majStyleBoutons() {
    const votedType = localStorage.getItem(`voted_${articleId}`);
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');

    if (!likeBtn || !dislikeBtn) return;

    // Reset des styles
    likeBtn.classList.remove('active');
    dislikeBtn.classList.remove('active');

    // Applique la classe active selon le vote stocké
    if (votedType === 'like') likeBtn.classList.add('active');
    if (votedType === 'dislike') dislikeBtn.classList.add('active');
}

// 4. Affichage des commentaires
function displayComments(comments) {
    const list = document.getElementById('comments-list');
    if (!list) return;
    list.innerHTML = ''; 

    comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        const dateStr = c.date ? new Date(c.date).toLocaleString('fr-FR') : "Date inconnue";
        div.innerHTML = `
            <p>${c.text}</p>
            <small>Posté le ${dateStr}</small>
        `;
        list.appendChild(div);
    });
}

// 5. Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    chargerArticle();

    // Liaison des boutons
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    
    if (likeBtn) likeBtn.onclick = () => envoyerReaction('like');
    if (dislikeBtn) dislikeBtn.onclick = () => envoyerReaction('dislike');

    // Formulaire de commentaire
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const input = document.getElementById('comment-input');
            const text = input.value;
            if (!text.trim()) return;

            try {
                const response = await fetch(`${BASE_URL}/api/articles/${articleId}/comment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text })
                });

                if (response.ok) {
                    input.value = '';
                    chargerArticle(); // Recharge pour voir le nouveau commentaire
                }
            } catch (err) {
                console.error("Erreur commentaire:", err);
            }
        };
    }
});