# Récolte et analyse de données

1. On fait passer un benchmark à l'utilisateur **connecté**
2. On lui fait passer 2-3 fois le **même exercice** (choisi aléatoirement)
3. On lui refait passer un autre benchmark (choisi aléatoirement)
4. On lui fait passer un autre type d'exercice parmi ceux restants (=> garder en mémoire celui effectué -> cookie?)
5. On lui refait passer un autre benchmark (choisi aléatoirement)

Note : la récolte des données se fait uniquement sur les benchmarks
Note 2 : ce n'est pas à l'utilisateur de choisir s'il fait un benchmark ou un
         exercice. Lorsqu'il se connecte, il est guidé au travers des différentes étapes

# TODO

- Page à propos pour expliquer ce dont il s'agit (une phase de récolte de données)
- Finir le le systèmes des benchmarks
- Finir le système des exercices
- Créer les exercices (+ table dans la BDD)
- Traitement des données (@Thomas)
- Persistence du thème dans un cookie
- Page utilisateur avec affichage des statistiques
- Ajout d'un timestamp sur les benchmarks

# Types d'exercices

Un exercice appartient a un type données. Il peut y avoir plusieurs exercices
du même type, avec des mots différents

- trigrammes
- ponctuation
- suite de mots à lettres peu courantes
- mots à grand espacement de lettres sur le clavier (avion, pandémie), accents et touches mortes
