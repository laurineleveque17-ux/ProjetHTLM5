/* ==========================================================================
   CONFIGURATION
   ========================================================================== */
const API_URL = "http://127.0.0.1:5000/api/auth";

/* ==========================================================================
   1. HEADER & NAVIGATION
   ========================================================================== */
function updateDisplay() {
    const viewGuest = document.getElementById('view-guest');
    const viewUser = document.getElementById('view-user');
    if (!viewGuest || !viewUser) return;

    const token = localStorage.getItem('token');
    if (token) {
        viewGuest.classList.add('hidden');
        viewUser.classList.remove('hidden');
    } else {
        viewGuest.classList.remove('hidden');
        viewUser.classList.add('hidden');
    }
}

function logout() {
    localStorage.removeItem('token');
    if (window.location.pathname.includes('profil.html')) {
        window.location.href = "index.html";
    } else {
        updateDisplay();
        window.location.reload();
    }
}

/* ==========================================================================
   2. AUTH (CONNEXION / INSCRIPTION)
   ========================================================================== */
function initAuthPage() {
    const connexionForm = document.getElementById('connexion-form');
    const inscriptionForm = document.getElementById('inscription-form');

    if (connexionForm) {
        connexionForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            const email = document.getElementById('identifiant').value;
            const password = document.getElementById('motdepasse').value;
            const erreurMessage = document.getElementById('erreur-connexion');
            erreurMessage.style.display = 'none';

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = "index.html";
                } else {
                    erreurMessage.textContent = data.msg || "Erreur connexion";
                    erreurMessage.style.display = 'block';
                }
            } catch (error) {
                console.error(error);
                erreurMessage.textContent = "Serveur injoignable";
                erreurMessage.style.display = 'block';
            }
        });
    }

    if (inscriptionForm) {
        inscriptionForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            
            const nom = document.getElementById('nom_inscr').value;
            const prenom = document.getElementById('prenom_inscr').value;
            const pseudo = document.getElementById('pseudo_inscr').value;
            const email = document.getElementById('email_inscr').value;
            const password = document.getElementById('motdepasse_inscr').value;
            const confirm = document.getElementById('confirmation_mdp').value;
            const errField = document.getElementById('erreur-inscription');

            if (password !== confirm) {
                errField.textContent = "Mots de passe différents.";
                errField.style.display = 'block';
                return;
            }

            try {
                const response = await fetch(`${API_URL}/register`, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nom, prenom, pseudo, email, password })
                });
                const data = await response.json();

                if (response.ok) {
                    alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                    
                    document.getElementById('inscription-form').reset();

                    
                    const loginEmail = document.getElementById('identifiant');
                    const loginPass = document.getElementById('motdepasse');

                    if (loginEmail) {
                        loginEmail.value = email; 
                        loginPass.focus();        
                    }
                }
                else {
                    errField.textContent = data.msg || "Erreur inscription";
                    errField.style.display = 'block';
                }
            } catch (error) {
                console.error(error);
                errField.textContent = "Serveur injoignable";
                errField.style.display = 'block';
            }
        });
    }
}

/* ==========================================================================
   3. PROFIL (RÉCUPÉRATION DES INFOS)
   ========================================================================== */
async function initProfilePage() {
    const inputPass = document.getElementById('password-input');
    // Si pas de champ mot de passe, on n'est pas sur la page profil
    if (!inputPass) return;

    const token = localStorage.getItem('token');
    
    // Si pas connecté, on renvoie à l'accueil
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    try {
        // C'EST ICI QU'ON RÉCUPÈRE LES INFOS !
        const response = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token // On envoie le badge
            }
        });

        if (response.ok) {
            const user = await response.json();
            // On remplit les trous dans le HTML
            document.getElementById('profile-nom').textContent = user.nom;
            document.getElementById('profile-pnom').textContent = user.prenom;
            document.getElementById('profile-user').textContent = user.pseudo;
            document.getElementById('profile-email').textContent = user.email;
        } else {
            // Si le token est périmé
            console.log("Erreur token, déconnexion...");
            logout();
        }

    } catch (error) {
        console.error("Erreur chargement profil:", error);
    }
}

// --- Fonctions Mot de Passe (Visuel) ---
function toggleVisibility() {
    const field = document.getElementById('password-input');
    field.type = (field.type === "password") ? "text" : "password";
}

function enableEdit() {
    const field = document.getElementById('password-input');
    const bEdit = document.getElementById('btn-edit');
    const bSave = document.getElementById('btn-save');
    field.disabled = false;
    field.classList.add('editable');
    field.focus();
    field.type = "text"; 
    bEdit.classList.add('hidden');
    bSave.classList.remove('hidden');
}

async function savePassword() {
    const field = document.getElementById('password-input');
    const bEdit = document.getElementById('btn-edit');
    const bSave = document.getElementById('btn-save');

    if (!field) return;

    const newPassword = field.value;
    const token = localStorage.getItem('token');

    // Petite sécurité : mot de passe vide ?
    if (!newPassword || newPassword.trim() === "") {
        alert("Le mot de passe ne peut pas être vide.");
        return;
    }

    try {
        // ENVOI AU SERVEUR (C'est ça qui rend le changement RÉEL)
        const response = await fetch(`${API_URL}/update`, {
            method: 'PUT', // On utilise PUT pour une mise à jour
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token // On prouve qu'on est connecté
            },
            body: JSON.stringify({ password: newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            // C'est bon, la base de données est à jour !
            alert("Mot de passe modifié avec succès !");

            // On met à jour la mémoire locale pour l'affichage
            localStorage.setItem('userPasswordSimulation', newPassword);

            // On reverrouille le champ
            field.disabled = true;
            field.classList.remove('editable');
            field.type = "password";

            bEdit.classList.remove('hidden');
            bSave.classList.add('hidden');
        } else {
            alert("Erreur : " + data.msg);
        }

    } catch (error) {
        console.error(error);
        alert("Impossible de contacter le serveur.");
    }
}


/* ==========================================================================
   4. GESTION DES ARTICLES (HOME)
   ========================================================================== */

// URL de l'API pour les articles
const API_ARTICLES = "http://127.0.0.1:5000/api/articles";

async function loadArticles() {
    const container = document.getElementById('contenu');
    // On vérifie qu'on est bien sur la page d'accueil
    if (!container) return;

    try {
        const response = await fetch(API_ARTICLES);
        const articles = await response.json();

        // On garde le titre "Dernières actus" mais on enlève les articles exemples
        // On sélectionne tous les articles existants pour les supprimer
        const existingArticles = container.querySelectorAll('.actu-card');
        existingArticles.forEach(art => art.remove());

        // Si aucun article n'est trouvé
        if (articles.length === 0) {
            const p = document.createElement('p');
            p.textContent = "Aucun article disponible pour le moment.";
            container.appendChild(p);
            return;
        }

        // On boucle sur chaque article reçu de la BDD
        articles.forEach(article => {
    const card = document.createElement('article');
    card.className = 'actu-card';
    
    // On récupère la date
    const dateObj = new Date(article.date_publication);
    const dateStr = dateObj.toLocaleDateString('fr-FR');

    card.innerHTML = `
        <div class="card-image-container">
            <img src="https://via.placeholder.com/200x150?text=News" alt="Image Article">
        </div>
        <div class="card-content">
            <h3 class="card-title">${article.title}</h3>
            <p class="card-description">${article.resume || "Cliquez pour voir le résumé..."}</p>
            <div class="card-meta">
                <span class="card-source">Source: ${article.source_nom || 'Inconnue'}</span>
                <span class="card-date">Le ${dateStr}</span>
            </div>
        </div>
    `;
    
    // 🔥 C'EST ICI QUE CA SE JOUE :
    // On utilise l'ID MongoDB pour rediriger vers notre page intermédiaire
    // Dans FrontEnd/script.js
card.addEventListener('click', () => {
    // On s'assure d'utiliser _id (avec l'underscore pour MongoDB)
    const articleId = article._id;
    window.location.href = `page_article.html?id=${articleId}`;
});

    container.appendChild(card);
});

    } catch (error) {
        console.error("Erreur chargement articles:", error);
        const p = document.createElement('p');
        p.style.color = "red";
        p.textContent = "Impossible de charger les articles.";
        container.appendChild(p);
    }
}

/* ==========================================================================
   INIT (Mise à jour)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    initAuthPage();
    initProfilePage();
    loadArticles(); // <--- 💡 AJOUTEZ CET APPEL ICI
});