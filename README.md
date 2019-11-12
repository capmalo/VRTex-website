# VRTex-website

Synthèse du sujet et analyse :

  Présentation de VRTex :
    VRTex est un projet initialement crée dans le cadre du projet de fin d'étude (PFE).
    L'objectif est de développer un logiciel en réalité virtuelle de visualisation de concepts mathématiques de géométrie 3D.
    Ce projet vise particulièrement les lycéens et étudiants qui ont des difficultés à se représenter des formes 3D en 2D.
    Par exemple, l'utilisateur pourra choisir de voir les étapes du calcul du volume d'un cube. 
    Il verra alors le cube évoluer ainsi que la formule géométrique le tout dans un espace virtuel permettant des interactions basiques.
    
   Le site à concevoir est une plateforme de vote attachée à ce projet. Il consiste en une solution proposant aux utilisateurs de voter pour les concepts mathématiques qu’ils voudraient voir implémentés dans l’application VRTex.
    
   Chaque utilisateur pourra créer un compte et se connecter pour pouvoir voter pour les concepts qu’il choisira et soumettre de nouveaux concepts. Les concepts seront validés par les administrateurs, disposant d’un compte spécifique autorisant également la création et la suppression des concepts mathématiques.

Synthèse du travail de conception :

- La connexion au site doit être sécurisée
- Les concepts et les commentaires proposés par l’utilisateur doivent être vérifiés afin qu’ils ne nuisent pas à l’intégrité du site ou aux autres utilisateurs (sécurité des formulaires et des requêtes)
- Les concepts et commentaires ne doivent pas comporter de propos diffamants, insultants ou dégradants (cette vérification se fera manuellement dans un premier temps, mais un système de signalement pourra être envisagé)


Feuille de route projet :

  Nous allons procéder comme ceci :
  1) Mettre en place le design général du site (style de liste "reddit")
  2) Créer une base de données regroupant les propositions et le nombre de votes associé
  3) Ajout d'un formulaire de soumission de propositions
  4) Création d'un système de sessions et verrouillage du formulaire aux seuls inscrits
  5) ....

Objectifs du prototype initial :

  Les objectifs du prototype initial sont les suivants :
  1) Afficher des propositions sous forme de liste
  2) Permettre aux visiteurs de voter (système +1 -1)
  3) Permettre aux visiteurs de soumettre des propositions
  
  Ces objectifs peuvent être ammenés à s'étoffer en fonction de la vitesse d'avancement du projet
