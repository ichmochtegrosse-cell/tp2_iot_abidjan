# Requirements — TP2 IoT Abidjan

## Outils obligatoires

### 1. Docker Desktop
- **Version minimale** : 4.x
- **macOS 12 (Monterey)** : utiliser la version 4.15
- Inclut Docker Engine + Docker Compose v2

> ⚠️ Sur macOS : lancer Docker Desktop AVANT toute commande docker.
> Si erreur `Cannot connect to Docker daemon` → `open -a Docker`

```bash
# Vérifier
docker --version           # Docker version 20.10.x+
docker compose version     # Docker Compose version v2.x.x
```

### 2. MongoDB Compass (recommandé)
Interface graphique pour explorer MongoDB visuellement.
- Télécharger : https://www.mongodb.com/try/download/compass
- Connection string : `mongodb://admin:ufhb2024!@localhost:27017`

### 3. mongosh (MongoDB Shell)
Pour exécuter les scripts `.js` en ligne de commande.

```bash
# Via Docker (sans installation locale)
docker exec -it mongodb mongosh -u admin -p ufhb2024! --authenticationDatabase admin

# Installation locale (optionnel)
brew install mongosh   # macOS
```

### 4. Git
```bash
git --version
# Si non installé : brew install git
```

---

## Vérification de l'environnement

```bash
# 1. Docker lancé ?
docker ps

# 2. Les 6 conteneurs tournent ?
docker compose ps
# Attendu : grafana, influxdb, mosquitto, telegraf, mongodb, mongo-express

# 3. MongoDB accessible ?
docker exec -it mongodb mongosh \
  -u admin -p ufhb2024! \
  --authenticationDatabase admin \
  --eval "db.adminCommand('ping')"
# Attendu : { ok: 1 }

# 4. Mongo-Express accessible ?
# Ouvrir http://localhost:8081 dans le navigateur
```

---

## Ordre de démarrage recommandé

```bash
# 1. Lancer Docker Desktop
open -a Docker   # macOS
# Attendre la baleine 🐳 dans la barre de menu

# 2. Démarrer tous les services
cd ~/Desktop/tp2_iot_abidjan
docker compose up -d

# 3. Attendre ~15 secondes que MongoDB démarre

# 4. Initialiser la base (une seule fois)
docker exec -i mongodb mongosh \
  -u admin -p ufhb2024! \
  --authenticationDatabase admin \
  < scripts/init_db.js

# 5. Insérer les événements (une seule fois)
docker exec -i mongodb mongosh \
  -u admin -p ufhb2024! \
  --authenticationDatabase admin \
  < scripts/events_insert.js

# 6. Lancer les requêtes (autant de fois que voulu)
docker exec -i mongodb mongosh \
  -u admin -p ufhb2024! \
  --authenticationDatabase admin \
  < scripts/queries.js
```

---

## Connexion via MongoDB Compass

1. Ouvrir MongoDB Compass
2. Connection string : `mongodb://admin:ufhb2024!@localhost:27017`
3. Cliquer **Connect**
4. Naviguer vers `iot_abidjan` → `devices` ou `events`

---

## Dépannage fréquent

| Problème | Solution |
|----------|----------|
| `Cannot connect to Docker daemon` | `open -a Docker` et attendre |
| `docker command not found` | Relancer Docker Desktop |
| MongoDB refuse la connexion | Attendre 15s après `docker compose up -d` |
| `MongoServerError: Authentication failed` | Vérifier `-u admin -p ufhb2024!` |
| `Document failed validation` | Vérifier les champs requis du JSON Schema |
| `COLLSCAN` dans explain() | Index non créé → relancer `init_db.js` |
| Mongo-Express affiche erreur | Attendre que MongoDB soit complètement démarré |
| `mongo-express` port 8081 occupé | Changer port dans `docker-compose.yml` |

---

## Commandes mongosh utiles

```bash
# Connexion interactive
docker exec -it mongodb mongosh -u admin -p ufhb2024! --authenticationDatabase admin

# Dans mongosh :
use iot_abidjan
db.devices.find().pretty()
db.devices.countDocuments()
db.events.countDocuments()
db.devices.getIndexes()
db.events.getIndexes()

# Vider et recommencer
db.devices.drop()
db.events.drop()
```

---

## Bibliothèques / Versions

| Composant | Version | Image Docker |
|-----------|---------|--------------|
| MongoDB | 7.x | `mongo:7` |
| Mongo-Express | 1.0 | `mongo-express:1.0` |
| InfluxDB | 2.7 | `influxdb:2.7` |
| Telegraf | 1.28 | `telegraf:1.28` |
| Grafana | 10.0.0 | `grafana/grafana:10.0.0` |
| Mosquitto | 2.x | `eclipse-mosquitto:2` |


