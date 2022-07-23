# Ptero Dactyl

## Développement local

Note sur les dépendances PHP et système :
- **Extensions PHP :** `zip`, `pdo_mysql`, `sysvsem`
- **Paquets systèmes :** `mariadb-client` (ou `mysql-client`), `unzip`, `wget`

### Avec Docker

```bash
# Construction de l'image Docker
$ docker compose build

# Installation des dépendances
$ docker compose run --rm composer install

# Migrations et seed de la base de données
$ docker compose run --rm symfony console doctrine:migrations:migrate # answer 'yes'
$ docker compose run --rm symfony console doctrine:fixtures:load      # anser 'yes'

# Démarrage du serveur de développement sur le port 8000
$ docker compose run --rm --service-ports web
```
