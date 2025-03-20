# WebAvance

[Templates de Smart Commits](docs/workflow/Git/Commit_Template.md)

[Normes de codage](docs/workflow/Normes_de_Codage.md)

[Git Flow](docs/workflow/Git/WorkFlow.md)

# Stratégie de gestion des branches Git

Notre projet adopte une stratégie de gestion des branches Git structurée autour de trois branches principales : `main`, `develop` et `staging`. Cette organisation facilite le développement, les tests et le déploiement de notre application.

## Branches principales

1. **`main`** :
   - **Rôle :** Contient le code stable prêt pour la production. Chaque commit sur cette branche représente une version publiée de l'application.
   - **Actions :**
     - Fusionner les versions validées depuis `staging`.
     - Déployer en production à partir de cette branche.

2. **`develop`** :
   - **Rôle :** Branche d'intégration principale où les développeurs fusionnent les nouvelles fonctionnalités en cours de développement.
   - **Actions :**
     - Créer des branches de fonctionnalités (`feature/*`) à partir de `develop`.
     - Après le développement et les tests unitaires, fusionner les branches de fonctionnalités dans `develop`.

3. **`staging`** :
   - **Rôle :** Environnement intermédiaire utilisé pour les tests approfondis et la validation avant le déploiement en production.
   - **Actions :**
     - Fusionner `develop` dans `staging` pour préparer une nouvelle version.
     - Effectuer des tests d'intégration et des validations sur `staging`.
     - Une fois validée, fusionner `staging` dans `main` pour le déploiement en production.

## Flux de travail recommandé

1. **Développement de fonctionnalités :**
   - Créer des branches de fonctionnalités (`feature/*`) à partir de `develop`.
   - Développer et tester les fonctionnalités sur ces branches.
   - Fusionner les branches de fonctionnalités terminées dans `develop`.

2. **Phase de test :**
   - Fusionner la branche `develop` dans `staging`.
   - Réaliser des tests approfondis sur `staging` pour s'assurer de la stabilité et de la qualité du code.

3. **Mise en production :**
   - Après validation sur `staging`, fusionner `staging` dans `main`.
   - Déployer le code en production à partir de la branche `main`.

Cette organisation en trois branches principales assure une séparation claire entre le développement, les tests et la production, réduisant ainsi les risques d'introduire des bugs en production et facilitant la gestion des versions du code.
