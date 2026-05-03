# TP2 IoT Abidjan — InfluxDB + MongoDB : Modélisation & Requêtes
**KOUADIO KOUASSI HIPOLITE | Master 1 BD & GL — UFHB Abidjan | Semaine 6**

Stack : Mosquitto | Telegraf | InfluxDB | Grafana | **MongoDB** | **Mongo-Express**

---

## Vue d'ensemble

Ce TP étend la stack IoT du TP1 en ajoutant **MongoDB** pour la gestion des métadonnées des dispositifs IoT. L'objectif est de comprendre la **polyglot persistence** : InfluxDB pour les métriques temporelles, MongoDB pour les documents structurés (devices, events).

```
ESP32 (Wokwi) → HiveMQ → Telegraf → InfluxDB  (métriques temps réel)
                                  ↓
                             MongoDB             (métadonnées + events)
                                  ↓
                          Mongo-Express          (UI web MongoDB)
```

---

## Prérequis

Voir `requirements.md` pour les détails complets.

- Docker Desktop >= 4.x lancé
- TP1 complété (optionnel mais recommandé)
- MongoDB Compass (interface graphique) — optionnel

---

## Démarrage rapide

```bash
# 1. Cloner le dépôt
git clone https://github.com/ichmochtegrosse-cell/tp2-iot-abidjan.git
cd tp2_iot_abidjan

# 2. Lancer tous les services (6 conteneurs)
docker compose up -d

# 3. Vérifier le statut
docker compose ps

# 4. Initialiser la base MongoDB
docker exec -i mongodb mongosh \
  -u admin -p ufhb2024! \
  --authenticationDatabase admin \
  < scripts/init_db.js

# 5. Insérer les 50 événements
docker exec -i mongodb mongosh \
  -u admin -p ufhb2024! \
  --authenticationDatabase admin \
  < scripts/events_insert.js

# 6. Exécuter les requêtes Q1–Q5
docker exec -i mongodb mongosh \
  -u admin -p ufhb2024! \
  --authenticationDatabase admin \
  < scripts/queries.js
```

---

## Services et ports

| Service        | URL                       | Credentials            |
|----------------|---------------------------|------------------------|
| InfluxDB        | http://localhost:8086     | admin / ufhb2024!      |
| Grafana         | http://localhost:3000     | admin / ufhb2024!      |
| MongoDB         | localhost:27017           | admin / ufhb2024!      |
| Mongo-Express   | http://localhost:8081     | (pas d'auth)           |
| Mosquitto MQTT  | localhost:1883            | anonymous              |

---

## Structure du projet

```
tp2_iot_abidjan/
├── docker-compose.yml        ← 6 services (TP1 + MongoDB + Mongo-Express)
├── mosquitto/
│   └── config/
│       └── mosquitto.conf
├── telegraf/
│   └── telegraf.conf
├── scripts/
│   ├── init_db.js            ← Partie 1 & 2 & 3 : collections + devices + index
│   ├── queries.js            ← Partie 4 : Q1–Q5 avec explain()
│   └── events_insert.js      ← Livrable ④ : 50 events réalistes
├── captures/                 ← Screenshots IXSCAN vs COLLSCAN
├── README.md
└── requirements.md
```

---

## Collections MongoDB

### `devices` — Métadonnées des capteurs
```json
{
  "device_id": "ESP32_001",
  "name": "Capteur Cocody Centre",
  "commune": "cocody",
  "location": { "type": "Point", "coordinates": [-4.0083, 5.3540] },
  "sensors": ["DHT22", "MQ135"],
  "firmware": { "version": "2.1.3", "updated": "2024-11-01" },
  "config": { "interval_s": 30, "active": true },
  "createdAt": "2026-04-22T..."
}
```

### `events` — Alertes et heartbeats (TTL 90 jours)
```json
{
  "device_id": "ESP32_001",
  "commune": "cocody",
  "type": "temperature_alert",
  "value": 34.2,
  "unit": "°C",
  "severity": "warning",
  "timestamp": "2026-04-20T10:30:00Z"
}
```

---

## Index créés

| Collection | Index                          | Type      | Utilité                    |
|------------|--------------------------------|-----------|----------------------------|
| devices    | `device_id: 1`                 | Unique    | Lookup par ID              |
| devices    | `location: '2dsphere'`         | 2dsphere  | Requêtes géospatiales      |
| devices    | `config.active: 1, commune: 1` | Composé   | Filtres ESR                |
| devices    | `sensors: 1`                   | Multikey  | Recherche dans tableau     |
| events     | `device_id: 1, timestamp: -1`  | Composé   | Tri ESR                    |
| events     | `timestamp: 1` (TTL)           | TTL       | Expiration 90 jours        |

---

## Requêtes Q1–Q5

| Requête | Description | Index utilisé |
|---------|-------------|---------------|
| Q1 | Capteurs actifs à Cocody | `config.active + commune` |
| Q2 | Capteurs avec DHT22 | `sensors` (multikey) |
| Q3 | Capteurs dans 3km du Plateau | `location` (2dsphere) |
| Q4 | Agrégation par commune | `config.active` |
| Q5 | Distance depuis Cocody Centre | `location` ($geoNear) |

---

## Arrêter la stack

```bash
docker compose down
# Supprimer aussi les volumes MongoDB :
docker compose down -v
```

---

## Comparaison InfluxDB vs MongoDB

| Critère | InfluxDB | MongoDB |
|---------|----------|---------|
| Type de données | Métriques temporelles | Documents structurés |
| Cas d'usage IoT | Température, humidité en temps réel | Métadonnées capteurs, événements |
| Requêtes | Flux QL (agrégations temporelles) | MQL (find, aggregate, geoNear) |
| Rétention | TTL automatique par bucket | TTL via index |
| Index géo | Non | 2dsphere natif |

---

Dépôt : github.com/ichmochtegrosse-cell/tp2-iot-abidjan
