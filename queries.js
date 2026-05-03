// ============================================================
// TP2 IoT Abidjan — KOUADIO KOUASSI HIPOLITE
// queries.js : 5 requêtes MongoDB Q1–Q5
// Chaque requête inclut un .explain('executionStats')
// pour vérifier l'utilisation des index (IXSCAN vs COLLSCAN)
// ============================================================

use iot_abidjan

// ════════════════════════════════════════════════════════════
// Q1 — Tous les capteurs actifs de Cocody (index composé)
// Index utilisé : { 'config.active': 1, commune: 1 }
// ════════════════════════════════════════════════════════════
print("=== Q1 : Capteurs actifs à Cocody ===");
db.devices.find(
  { commune: 'cocody', 'config.active': true },
  { device_id: 1, name: 1, sensors: 1, _id: 0 }
).pretty();

// Explain Q1 — doit afficher IXSCAN
print("=== Q1 explain ===");
db.devices.find(
  { commune: 'cocody', 'config.active': true }
).explain('executionStats').executionStats.executionStages;


// ════════════════════════════════════════════════════════════
// Q2 — Capteurs intégrant un DHT22 (index multikey)
// Index utilisé : { sensors: 1 }
// ════════════════════════════════════════════════════════════
print("=== Q2 : Capteurs avec DHT22 ===");
db.devices.find(
  { sensors: 'DHT22' },
  { device_id: 1, commune: 1, sensors: 1, _id: 0 }
).pretty();


// ════════════════════════════════════════════════════════════
// Q3 — Capteurs dans un rayon de 3km du Plateau ($near)
// Index utilisé : { location: '2dsphere' }  (OBLIGATOIRE)
// ════════════════════════════════════════════════════════════
print("=== Q3 : Capteurs à moins de 3km du Plateau ===");
db.devices.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [-4.0167, 5.3167] },
      $maxDistance: 3000  // mètres
    }
  }
}).projection({ device_id: 1, commune: 1, _id: 0 }).pretty();

// Explain Q3 — doit afficher IXSCAN (2dsphere)
print("=== Q3 explain ===");
db.devices.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [-4.0167, 5.3167] },
      $maxDistance: 3000
    }
  }
}).explain('executionStats').executionStats.executionStages;


// ════════════════════════════════════════════════════════════
// Q4 — Pipeline : nombre de capteurs actifs par commune ($group)
// ════════════════════════════════════════════════════════════
print("=== Q4 : Capteurs actifs par commune ===");
db.devices.aggregate([
  { $match: { 'config.active': true } },
  {
    $group: {
      _id: '$commune',
      nb_devices:   { $sum: 1 },
      sensor_types: { $addToSet: '$sensors' }
    }
  },
  { $sort: { nb_devices: -1 } }
]).pretty();


// ════════════════════════════════════════════════════════════
// Q5 — Pipeline géospatial : distance depuis Cocody Centre ($geoNear)
// Retourne tous les capteurs triés par distance croissante
// ════════════════════════════════════════════════════════════
print("=== Q5 : Distance depuis Cocody Centre ===");
db.devices.aggregate([
  {
    $geoNear: {
      near:          { type: 'Point', coordinates: [-4.0083, 5.354] },
      distanceField: 'distance_m',
      maxDistance:   10000,  // 10km
      spherical:     true
    }
  },
  { $project: { device_id: 1, commune: 1, distance_m: 1, _id: 0 } },
  { $sort: { distance_m: 1 } }
]).pretty();
