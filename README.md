# ProjetHTML5 5News
Ce projet permet de rassembler plusieurs articles de différents médias en utilisant l'API Gnews. Ensuite grâce à l'API de open AI on en fait des résumés lisibles très rapidement. En soit, vous pouvez faire le tour de l'actualité mondiale en 5 minutes et y réagir !

**Membres du projet:** 
    Baptiste Guicheteau: Développement des scripts en lien avec les API Gnews et OpenAI. Ces scripts gèrent toute la logique de récupération d'article et de traitement. 
    Noé Hebel: Développement des scripts de communication avec la base de donnée et des scripts de connexion utilisateur et intéractions. 
    Kilian Champin: Développement des pages principales (HTML/CSS/JS), des pages individuelles d'articles et des intéractions utilisateurs.
    Laurine Lévêque: Développement des pages principales (HTML/CSS/JS) et des scripts js de connexion utilisateur.

    Chacun a également dû régler des bugs et des conflits, forçant tout les membres à explorer et modifier des parties qui ne s'inscrivent pas forcément dans le cadre de leurs missions.

**Technologies utilisées:**
Nous avons travaillé avec différentes API, Gnews et OpenAI.
De plus notre site fonctionne en nodejs, il y a donc un serveur backend et un serveur frontend. 

**Fonctionalités :**
-**Collecte Automatisée** : Toutes les 18 heures le site renouvelle ses informations AUTOMATIQUEMENT grâce à un script cron. Il récupère son contenu depuis un web scrapper et fait ensuite son résumé.
-**Des sources sûres**: L'API Gnews permet de recueillir l'information sur des sites fiables. 
-**Une alerte avant la rotation des articles**: Toutes les 5 minutes avant la rotation des articles l'utilisateur est prévenu.

**Bugs et améliorations possibles**
-**Collecte longue**: La collecte des articles peut être assez longue, laissant les pages des catégories traitées en dernières vide quelques instants. 
-**Barre recherche**: Bien que présente la barre recherche est inutilisable.
-**Des articles ne correspondant pas totalement aux filtres**: Ayant utilisé la version gratuite de Gnews, sa puissance a été réduite. Ainsi certains articles se retrouvent là où ils ne devraient pas être.