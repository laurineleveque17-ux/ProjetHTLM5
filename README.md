# 📡 5News : L'essentiel de l'info en 5 minutes

 **Le concept :** Un site qui regroupe les dernières informations de l'actualité mondiale. Grâce à l'IA, nous transformons des flux d'articles complexes en résumés pertinents pour vous permettre de rester informé en un clin d'œil.

---

## Le Coeur du Projet
Notre plateforme repose sur une synergie entre le scraping de données et l'intelligence artificielle :

* **Sourcing via GNews** : Extraction d'articles depuis des sources médiatiques fiables.
* **Synthèse OpenAI** : Traitement automatique des textes pour générer des résumés efficaces.
* **Architecture Node.js** : Une structure Fullstack avec un serveur Backend robuste et une interface Frontend fluide.

---

## L'Équipe & Missions
*Chaque membre a contribué à la résolution des bugs  et à la gestion des conflits Git, développant une polyvalence certaine.*

* **Baptiste Guicheteau** Développement des scripts Gnews et OpenAI. Gestion de la logique de récupération et de traitement des données.
* **Noé Hebel** Gestion de la base de données, sécurisation des connexions utilisateurs et logique des interactions.
* **Kilian Champin** Design et intégration des pages principales et individuelles. Création des composants d'interaction client.
* **Laurine Lévêque** Conception des interfaces et implémentation des scripts de connexion utilisateur.

---

## Fonctionnalités Clés
* **🔄 Collecte Automatisée** : Un script `cron` renouvelle l'intégralité des informations tous les jours à 00h05 sans intervention humaine.
* **💬 Espace d'Expression** : Possibilité de commenter et de réagir (Like/Dislike) aux actualités après connexion.

---

## Transparence & Améliorations
*Nous restons conscients des axes de progression de cette version :*

1.  **Optimisation de la collecte** : Le temps de traitement par l'IA peut rendre certaines catégories momentanément vides lors de la rotation.
2.  **Moteur de recherche** : La barre de recherche est présente graphiquement mais nécessite encore l'implémentation de sa logique.
3.  **Précision des filtres** : L'utilisation de la version gratuite de GNews peut parfois entraîner des légers décalages dans la catégorisation des articles dû au bridage de cette version.

---

## Lancer 5News 
> **Important** : Toute exécution en mode local nécessite l'accès à notre fichier `.env` dans le dossier backend.

### Sur Windows (Recommandé)
Le projet est automatisé pour Windows :
1. Clonez le code source.
2. Double-cliquez sur le fichier **`Launch.bat`** à la racine.
3. Le site se lancera seul après environ **1 minute**, laissant le temps au backend et aux dépendances de se stabiliser.

### Sur macOS ou Linux
Le lancement doit être effectué manuellement :
1. Ouvrez un terminal dans les dossiers `/backend` et `/backend/tasks` puis exécutez `npm install`.
2. Lancez le serveur depuis le dossier `/backend` avec la commande `node main.js`.
3. Ouvrez le fichier `index.html` situé dans le dossier `/frontend`.

### Disponible sur Internet
Si vous souhaitez utiliser notre site sans rien installer, il est déployé à l'adresse suivante : **[http://92.128.72.137](http://92.128.72.137)**