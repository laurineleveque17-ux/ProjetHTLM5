# 📡 5News : L'essentiel de l'info en 5 minutes

 **Le concept :** Un agrégateur intelligent qui condense l'actualité mondiale. Grâce à l'IA, nous transformons des flux d'articles complexes en résumés digestes pour vous permettre de rester informé en un clin d'œil.

---

## Le Coeur du Projet
Notre plateforme repose sur une synergie entre le scraping de données et l'intelligence artificielle :

* **Sourcing via GNews** : Extraction d'articles depuis des sources médiatiques fiables et variées.
* **Synthèse OpenAI** : Traitement automatique des textes pour générer des résumés pertinents.
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
* **🔄 Collecte Automatisée** : Un script `cron` renouvelle l'intégralité des informations toutes les 18 heures sans intervention humaine.
* **🕒 Alerte de Rotation** : Un système de notification prévient l'utilisateur 5 minutes avant le rafraîchissement des articles pour ne rien manquer.
* **💬 Espace d'Expression** : Possibilité de commenter et de réagir (Like/Dislike) aux actualités après connexion.

---

## Transparence & Améliorations
*Nous restons lucides sur les axes de progression de cette version :*

1.  **Optimisation de la collecte** : Le temps de traitement par l'IA peut rendre certaines catégories momentanément vides lors de la rotation.
2.  **Moteur de recherche** : La barre de recherche est présente graphiquement mais nécessite encore l'implémentation de sa logique de filtrage.
3.  **Précision des filtres** : L'utilisation de la version gratuite de GNews peut parfois entraîner des légers décalages dans la catégorisation des articles.

---

## Lancer 5News 

A compléter