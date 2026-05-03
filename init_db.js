// ============================================================
// TP2 IoT Abidjan — KOUADIO KOUASSI HIPOLITE
// init_db.js : Initialisation MongoDB
// Étapes : createCollection + validation + insertMany + index
// ============================================================

// ── 1. Sélection de la base ──────────────────────────────────
use iot_abidjan

// ── 2. Collection 'devices' avec validation JSON Schema ──────
db.createCollection('devices', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['device_id', 'commune', 'location', 'sensors', 'createdAt'],
      properties: {
        device_id: { bsonType: 'string' },
        commune: {
          bsonType: 'string',
          enum: ['cocody', 'yopougon', 'plateau', 'marcory', 'adjame']
        },
        location: {
          bsonType: 'object',
          required: ['type', 'coordinates'],
          properties: {
            type:        { bsonType: 'string', enum: ['Point'] },
            coordinates: { bsonType: 'array', minItems: 2, maxItems: 2 }
          }
        },
        sensors: { bsonType: 'array', minItems: 1 },
        config:  { bsonType: 'object' }
      }
    }
  },
  validationAction: 'error'
});

// ── 3. Collection 'events' avec TTL 90 jours ─────────────────
db.createCollection('events');
db.events.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

// ── 4. Insertion des 5 devices (communes d'Abidjan) ──────────
db.devices.insertMany([
  {
    device_id: 'ESP32_001',
    name: 'Capteur Cocody Centre',
    commune: 'cocody',
    location: { type: 'Point', coordinates: [-4.0083, 5.3540] },
    sensors: ['DHT22', 'MQ135'],
    firmware: { version: '2.1.3', updated: new Date('2024-11-01') },
    config: { interval_s: 30, active: true },
    createdAt: new Date()
  },
  {
    device_id: 'ESP32_015',
    name: 'Capteur Yopougon Marché',
    commune: 'yopougon',
    location: { type: 'Point', coordinates: [-4.0748, 5.3396] },
    sensors: ['DHT22'],
    firmware: { version: '2.0.1', updated: new Date('2024-10-15') },
    config: { interval_s: 30, active: true },
    createdAt: new Date()
  },
  {
    device_id: 'ESP32_042',
    name: 'Capteur Plateau Indénié',
    commune: 'plateau',
    location: { type: 'Point', coordinates: [-4.0167, 5.3167] },
    sensors: ['MQ135'],
    firmware: { version: '1.8.0', updated: new Date('2024-09-20') },
    config: { interval_s: 60, active: true },
    createdAt: new Date()
  },
  {
    device_id: 'ESP32_031',
    name: 'Capteur Marcory Zone 4',
    commune: 'marcory',
    location: { type: 'Point', coordinates: [-3.9951, 5.3013] },
    sensors: ['DHT22', 'GPS_NEO6M'],
    firmware: { version: '2.1.3', updated: new Date('2024-11-01') },
    config: { interval_s: 30, active: true },
    createdAt: new Date()
  },
  {
    device_id: 'ESP32_058',
    name: 'Capteur Adjamé Marché',
    commune: 'adjame',
    location: { type: 'Point', coordinates: [-4.0234, 5.3634] },
    sensors: ['DHT22', 'MQ135'],
    firmware: { version: '2.1.3', updated: new Date('2024-11-01') },
    config: { interval_s: 30, active: false },
    createdAt: new Date()
  }
]);

// ── 5. Création des index ─────────────────────────────────────

// Index unique sur device_id
db.devices.createIndex({ device_id: 1 }, { unique: true });

// Index 2dsphere pour requêtes géospatiales ($near, $geoNear)
db.devices.createIndex({ location: '2dsphere' });

// Index composé : devices actifs par commune (règle ESR)
db.devices.createIndex({ 'config.active': 1, commune: 1 });

// Index multikey sur le tableau sensors
db.devices.createIndex({ sensors: 1 });

// Index composé sur events (Equality → Sort) ESR
db.events.createIndex({ device_id: 1, timestamp: -1 });

// ── 6. Vérification ──────────────────────────────────────────
print("=== Index devices ===");
db.devices.getIndexes();

print("=== Index events ===");
db.events.getIndexes();

print("=== Devices insérés ===");
db.devices.countDocuments();
// Attendu : 5
