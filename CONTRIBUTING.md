# Contribuer

Merci d'être là et de vouloir contribuer :)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Comment aider ?](#comment-aider-)
  - [Proposer des améliorations de l'application](#proposer-des-am%C3%A9liorations-de-lapplication)
  - [Aider au développement de l'application](#aider-au-d%C3%A9veloppement-de-lapplication)
- [Informations supplémentaires](#informations-suppl%C3%A9mentaires)
  - [Stack technique](#stack-technique)
    - [Frontend](#frontend)
    - [DevOps](#devops)
  - [Schéma d'architecture](#sch%C3%A9ma-darchitecture)
  - [Lancer le projet en local](#lancer-le-projet-en-local)
    - [Installer l'application](#installer-lapplication)
    - [Lancer l'application](#lancer-lapplication)
  - [Lancer les tests](#lancer-les-tests)
  - [Autres commandes utiles](#autres-commandes-utiles)
    - [Commandes Frontend](#commandes-frontend)
    - [Commandes Autres](#commandes-autres)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Comment aider ?

- Remonter les bugs
- Faire des propositions d'améliorations (grâce aux Issues Github)
- Aider à développer l'application (grâce aux Issues et Pull Requests Github)

### Proposer des améliorations de l'application

Vous avez vu un bug ? Vous trouvez l'app contre-intuitive, ou simplement avez une idée pour rendre le design plus beau/propre ?

Il y a deux options pour remonter ces informations :
- via la page [Contribuer](https://quizanthropocene.fr/contribuer) de l'application
- ou créer une Issue dans l'interface Github du projet ([ici](https://github.com/quiz-anthropocene/public-frontend/issues))

### Aider au développement de l'application

_La stack technique est détaillée un peu plus bas._

Relecture de code, documentation, rajouter des tests, design, ajouter une fonctionnalité, etc

Si vous souhaitez ajouter une fonctionnalité :
- commentez l'Issue en question pour donner votre point de vue (ou créez l'Issue si elle n'existe pas encore), et on discutera ensemble de la meilleur façon de procéder
- créez ensuite une PR et demandez une review (relecture)

## Informations supplémentaires

### Stack technique

#### Frontend

- Un Frontend en Vue.js
- Bootstrap 4

La donnée est lue directement depuis les fichiers yaml dans le dossier `/data`.

#### DevOps

- Le Frontend est hébergé sur Netlify (free tier)
- CI/CD avec Github Actions

### Schéma d'architecture

Voir dans le dossier `/data/architecture`

### Lancer le projet en local

#### Installer l'application

- Installez les dépendances du Frontend
    ```
    cd frontend
    yarn install
    ```
- Dupliquer le fichier `frontend/.env.example` et le renommer en `frontend/.env`
\* Voir section Windows à la fin si cette section pose problème

#### Lancer l'application

```
cd frontend
yarn serve
```

Le Frontend sera accessible à l'url `http://localhost:8080`

### Lancer les tests

Tests
```
yarn test:e2e
```

Linting
```
yarn lint
```

### Autres commandes utiles

#### Commandes Frontend

Lancer le Frontend "en mode production"
```
yarn build
// installer le package 'serve' : npm install -g serve
serve -s dist
```

Launch the Vue.js UI
```
vue ui
```

Update packages
```
yarn upgrade
yarn upgrade-interactive
```

#### Commandes Autres

Réduire la taille des images (PNG)
- Installer [pngquant](https://pngquant.org/)
- Lancer sur un fichier donné : `pngquant -f --ext .png <filename>`
- Ou lancer sur tous les fichiers d'un dossier : `pngquant -f --ext .png **/*.png`

#### Spécifique pour Windows

Installer yarn et nodejs
- Recommandé d'installer [chocolatey](https://chocolatey.org/install)

Puis dans powershell
```
choco install yarn
choco install nodejs-lts
```

Erreur `UnicodeDecodeError: charmap codec can't decode byte`
- Rajouter `-X utf8`

#### Misc

- Si vous avez nodejs > v17, il y aura un problème avec openssl, faites un downgrade à la version 16 LTS
- Les tests échouent avec une erreur `Local Chrome version is XXX, but the installed chromedriver is for version YYY` ? Il faut mettre à jour `chromedriver` dans `package.json`, puis lancer un `yarn install`.
