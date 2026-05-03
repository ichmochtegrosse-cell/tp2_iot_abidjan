// ============================================================
// TP2 IoT Abidjan — KOUADIO KOUASSI HIPOLITE
// events_insert.js : 50 documents events réalistes
// Types : temperature_alert, humidity_alert, air_quality, heartbeat
// ============================================================

use iot_abidjan

const devices = ['ESP32_001', 'ESP32_015', 'ESP32_042', 'ESP32_031', 'ESP32_058'];
const eventTypes = ['temperature_alert', 'humidity_alert', 'air_quality', 'heartbeat', 'low_battery'];
const communes = {
  'ESP32_001': 'cocody',
  'ESP32_015': 'yopougon',
  'ESP32_042': 'plateau',
  'ESP32_031': 'marcory',
  'ESP32_058': 'adjame'
};

// Génère une date aléatoire dans les 30 derniers jours
function randomDate() {
  const now = new Date();
  const msBack = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
  return new Date(now.getTime() - msBack);
}

const events = [];

// 50 événements réalistes
const rawEvents = [
  // ESP32_001 — Cocody (10 events)
  { device_id: 'ESP32_001', type: 'temperature_alert', value: 34.2, unit: '°C', severity: 'warning' },
  { device_id: 'ESP32_001', type: 'humidity_alert',    value: 88.5, unit: '%',  severity: 'warning' },
  { device_id: 'ESP32_001', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_001', type: 'air_quality',       value: 142,  unit: 'AQI', severity: 'moderate' },
  { device_id: 'ESP32_001', type: 'temperature_alert', value: 35.8, unit: '°C', severity: 'critical' },
  { device_id: 'ESP32_001', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_001', type: 'humidity_alert',    value: 91.2, unit: '%',  severity: 'critical' },
  { device_id: 'ESP32_001', type: 'air_quality',       value: 98,   unit: 'AQI', severity: 'good'   },
  { device_id: 'ESP32_001', type: 'temperature_alert', value: 33.1, unit: '°C', severity: 'warning' },
  { device_id: 'ESP32_001', type: 'low_battery',       value: 12,   unit: '%',  severity: 'warning' },

  // ESP32_015 — Yopougon (10 events)
  { device_id: 'ESP32_015', type: 'temperature_alert', value: 31.5, unit: '°C', severity: 'info'    },
  { device_id: 'ESP32_015', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_015', type: 'humidity_alert',    value: 75.0, unit: '%',  severity: 'info'    },
  { device_id: 'ESP32_015', type: 'temperature_alert', value: 36.4, unit: '°C', severity: 'critical' },
  { device_id: 'ESP32_015', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_015', type: 'air_quality',       value: 55,   unit: 'AQI', severity: 'good'   },
  { device_id: 'ESP32_015', type: 'humidity_alert',    value: 82.3, unit: '%',  severity: 'warning' },
  { device_id: 'ESP32_015', type: 'temperature_alert', value: 29.8, unit: '°C', severity: 'info'    },
  { device_id: 'ESP32_015', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_015', type: 'low_battery',       value: 8,    unit: '%',  severity: 'critical' },

  // ESP32_042 — Plateau (10 events)
  { device_id: 'ESP32_042', type: 'air_quality',       value: 178,  unit: 'AQI', severity: 'unhealthy' },
  { device_id: 'ESP32_042', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_042', type: 'air_quality',       value: 203,  unit: 'AQI', severity: 'very_unhealthy' },
  { device_id: 'ESP32_042', type: 'temperature_alert', value: 32.0, unit: '°C', severity: 'warning' },
  { device_id: 'ESP32_042', type: 'air_quality',       value: 145,  unit: 'AQI', severity: 'unhealthy' },
  { device_id: 'ESP32_042', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_042', type: 'air_quality',       value: 89,   unit: 'AQI', severity: 'moderate' },
  { device_id: 'ESP32_042', type: 'low_battery',       value: 15,   unit: '%',  severity: 'warning' },
  { device_id: 'ESP32_042', type: 'temperature_alert', value: 30.5, unit: '°C', severity: 'info'    },
  { device_id: 'ESP32_042', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },

  // ESP32_031 — Marcory (10 events)
  { device_id: 'ESP32_031', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_031', type: 'temperature_alert', value: 33.7, unit: '°C', severity: 'warning' },
  { device_id: 'ESP32_031', type: 'humidity_alert',    value: 79.5, unit: '%',  severity: 'info'    },
  { device_id: 'ESP32_031', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_031', type: 'temperature_alert', value: 37.1, unit: '°C', severity: 'critical' },
  { device_id: 'ESP32_031', type: 'humidity_alert',    value: 92.0, unit: '%',  severity: 'critical' },
  { device_id: 'ESP32_031', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_031', type: 'air_quality',       value: 67,   unit: 'AQI', severity: 'moderate' },
  { device_id: 'ESP32_031', type: 'low_battery',       value: 22,   unit: '%',  severity: 'warning' },
  { device_id: 'ESP32_031', type: 'temperature_alert', value: 28.9, unit: '°C', severity: 'info'    },

  // ESP32_058 — Adjamé (10 events)
  { device_id: 'ESP32_058', type: 'air_quality',       value: 256,  unit: 'AQI', severity: 'hazardous' },
  { device_id: 'ESP32_058', type: 'temperature_alert', value: 34.9, unit: '°C', severity: 'critical' },
  { device_id: 'ESP32_058', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_058', type: 'humidity_alert',    value: 85.0, unit: '%',  severity: 'warning' },
  { device_id: 'ESP32_058', type: 'air_quality',       value: 190,  unit: 'AQI', severity: 'unhealthy' },
  { device_id: 'ESP32_058', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
  { device_id: 'ESP32_058', type: 'temperature_alert', value: 32.5, unit: '°C', severity: 'warning' },
  { device_id: 'ESP32_058', type: 'air_quality',       value: 112,  unit: 'AQI', severity: 'unhealthy' },
  { device_id: 'ESP32_058', type: 'low_battery',       value: 5,    unit: '%',  severity: 'critical' },
  { device_id: 'ESP32_058', type: 'heartbeat',         value: 1,    unit: null, severity: 'info'    },
];

// Ajout du timestamp et commune à chaque event
rawEvents.forEach((e, i) => {
  events.push({
    ...e,
    commune:   communes[e.device_id],
    timestamp: randomDate(),
    metadata:  { index: i + 1, processed: false }
  });
});

// Insertion des 50 événements
const result = db.events.insertMany(events);
print(`✅ ${result.insertedIds ? Object.keys(result.insertedIds).length : 0} événements insérés`);

// Vérification
print("=== Répartition par device ===");
db.events.aggregate([
  { $group: { _id: '$device_id', count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).forEach(d => print(`${d._id}: ${d.count} events`));

print("=== Répartition par type ===");
db.events.aggregate([
  { $group: { _id: '$type', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]).forEach(t => print(`${t._id}: ${t.count}`));
