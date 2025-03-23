# WebAvance – Monorepo CESIMANGE

[📝 Templates de Smart Commits](docs/workflow/Git/Commit_Template.md)  
[📐 Normes de codage](docs/workflow/Normes_de_Codage.md)  
[🔀 Git Flow](docs/workflow/Git/WorkFlow.md)

---

## Initialisation & Lancement du Projet

Ce projet est organisé en **monorepo hybride** combinant :

- Des **apps** (front, proxy, middleware) gérées via **Yarn Workspaces** dans le dossier `apps/`.
- Des **services** (API, microservices, etc.) gérés avec **npm** dans le dossier `platforms/`.

### Ordre d'Initialisation et de Build

1. **Installation globale (Cesimange/apps)**  
   Depuis la racine du projet, exécutez :

   ```bash
   yarn install
   ```

   Cette commande installe toutes les dépendances partagées et prépare l'environnement des workspaces.

2. **Build des modules des apps (Yarn Workspaces)**  
   Important : Vous devez builder le proxy et le middleware avant de lancer le front en mode développement.  
   Par exemple, pour le client **customer-final** :

   - **Build du proxy** :
     ```bash
     yarn workspace customer-final-proxy build
     ```
   - **Build du middleware** :
     ```bash
     yarn workspace customer-final-middleware build
     ```

3. **Lancement de l'app front (customer-final)**  
   Une fois le proxy et le middleware buildés, lancez le front en mode développement :

   ```bash
   cd apps/customer-final/front
   npm run dev
   ```

4. **Installation des services (platforms) (npm)**  
   Pour chaque service, installez les dépendances localement :

   - **ModelGenerator** :
     ```bash
     cd platforms/services/ModelGenerator
     npm install
     ```
   - **user-service** :
     ```bash
     cd platforms/services/user-service
     npm install
     ```

5. **Lancement de l’API Gateway avec Nginx**  
   Pour lancer l'API Gateway, assurez-vous que **make** est installé globalement.
   - Installez make (si nécessaire) :
     ```bash
     npm install -g make
     ```
   - Ensuite, lancez l'API Gateway depuis la racine :
     ```bash
     make up
     ```

---

## Structure du Projet (Arborescence Simplifiée)

```
.
├── apps/
│   └── customer-final/
│       ├── front/
│       ├── proxy/
│       └── local-middleware/
├── platforms/
│   ├── api-gateway/
│   └── services/
│       ├── ModelGenerator/
│       └── user-service/
├── yarn.lock
├── package.json
└── Makefile
```

---

## Stratégie de Gestion des Branches Git

Le projet suit une stratégie de gestion des branches inspirée de Git Flow, organisée autour de trois branches principales :

### Branches Principales

1. **`main`**

   - **Rôle :** Code stable prêt pour la production. Chaque commit représente une version publiée.
   - **Actions :**
     - Fusionner les versions validées depuis `staging`.
     - Déployer en production à partir de cette branche.

2. **`develop`**

   - **Rôle :** Branche d'intégration principale où les développeurs fusionnent les nouvelles fonctionnalités.
   - **Actions :**
     - Créer des branches de fonctionnalités (`feature/*`) à partir de `develop`.
     - Après développement et tests unitaires, fusionner les branches de fonctionnalités dans `develop`.

3. **`staging`**
   - **Rôle :** Environnement intermédiaire pour les tests approfondis et la validation avant production.
   - **Actions :**
     - Fusionner `develop` dans `staging` pour préparer une nouvelle version.
     - Effectuer des tests d'intégration et valider sur `staging`.
     - Fusionner `staging` dans `main` pour le déploiement en production.

### Flux de Travail Recommandé

1. **Développement de Fonctionnalités**

   ```bash
   git checkout develop
   git checkout -b feature/ma-nouvelle-fonction
   # Développement, commits et tests...
   git checkout develop
   git merge feature/ma-nouvelle-fonction
   ```

2. **Phase de Test**

   ```bash
   git checkout staging
   git merge develop
   # Réaliser des tests approfondis
   ```

3. **Mise en Production**
   ```bash
   git checkout main
   git merge staging
   # Déploiement depuis main
   ```

---

## Récapitulatif des Commandes Utiles

| Étape                                   | Commande                                              |
| --------------------------------------- | ----------------------------------------------------- |
| Installer toutes les dépendances        | `yarn install`                                        |
| Build du proxy                          | `yarn workspace customer-final-proxy build`           |
| Build du middleware                     | `yarn workspace customer-final-middleware build`      |
| Lancer le front en mode dev             | `cd apps/customer-final/front` puis `npm run dev`     |
| Installer les services (ModelGenerator) | `cd platforms/services/ModelGenerator && npm install` |
| Installer les services (user-service)   | `cd platforms/services/user-service && npm install`   |
| Installer make globalement              | `npm install -g make`                                 |
| Lancer l'API Gateway                    | `make up`                                             |

---

## Notes & Adaptations

- **Ajout de Nouveaux Apps :**  
  Pour chaque nouvelle app dans `apps/`, suivez le même modèle :

  - Ajoutez un workspace dans le `package.json` à la racine.
  - Utilisez `yarn workspace <workspace-name> build` pour builder les modules requis.

- **Ordre de Build :**  
  Il est impératif de builder **proxy** et **middleware** avant de lancer le front pour garantir le bon fonctionnement des dépendances.

- **Services :**  
  Les services situés dans `platforms/services/` utilisent npm et nécessitent leur propre installation (`npm install`).

- **API Gateway :**  
  L’API Gateway est lancée via un Makefile, en s'assurant que `make` est installé globalement.

---

Ce README structuré permet à l'équipe de bien comprendre l'ordre d'exécution et les commandes à utiliser pour initialiser, builder et lancer chaque partie du projet.  
N'hésitez pas à l'adapter en fonction de l'évolution de l'architecture ou des outils utilisés.

