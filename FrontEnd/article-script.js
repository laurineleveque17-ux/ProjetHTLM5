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
        const response = await fetch(`${BASE_URL}/api/articles/id/${articleId}`);
        const article = await response.json();

        if (response.ok) {
            // Textes
            document.getElementById('article-title').textContent = article.title;
            document.getElementById('summary-text').textContent = article.resume || article.content || "Aucun résumé.";

            // Commentaires
            if (article.comments) {
                displayComments(article.comments);
            }

            // Source
            const sourceBtn = document.getElementById('source-link');
            if (article.url_originale && sourceBtn) {
                sourceBtn.onclick = () => window.open(article.url_originale, '_blank');
            }

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
        const response = await fetch(`${BASE_URL}/api/articles/id/${articleId}/react`, {
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
        
        // On utilise c.pseudo qui est stocké dans ta BDD
        const auteur = c.pseudo || "Anonyme";
        const dateStr = new Date(c.createdAt).toLocaleString('fr-FR');

        div.innerHTML = `
            <div style="margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 5px;">
                <strong style="color: #800020;">${auteur}</strong> 
                <small style="color: #888; margin-left: 10px;">le ${dateStr}</small>
                <p style="margin: 5px 0 0 0;">${c.text}</p>
            </div>
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
            const token = localStorage.getItem('token'); // On récupère le jeton ici

            if (!text.trim()) return;
            if (!token) {
                alert("Vous devez être connecté pour commenter.");
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/api/articles/id/${articleId}/comment`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-auth-token': token // Crucial pour que req.user.pseudo existe côté serveur
                    },
                    body: JSON.stringify({ text: text })
                });

                if (response.ok) {
                    input.value = '';
                    // On appelle chargerArticle qui, grâce au point n°1 de mon message précédent, 
                    // va récupérer les commentaires avec leurs pseudos
                    chargerArticle(); 
                } else {
                    const errorData = await response.json();
                    alert(errorData.msg || "Erreur lors de l'envoi");
                }
            } catch (err) {
                console.error("Erreur lors de l'envoi :", err);
            }
        };
    }
});