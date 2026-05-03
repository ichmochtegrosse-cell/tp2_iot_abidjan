use("iot_abidjan");

// Supprimer la validation stricte et réinsérer
db.runCommand({
  collMod: "events",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["device_id", "timestamp", "temperature", "humidity"],
      properties: {
        device_id: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        temperature: { bsonType: ["double", "int"] },
        humidity: { bsonType: ["double", "int"] }
      }
    }
  }
});

db.events.deleteMany({});

const devices = ["ESP32_001", "ESP32_002", "ESP32_003", "ESP32_004", "ESP32_005"];
const locations = ["cocody", "plateau", "yopougon", "abobo", "koumassi"];
const events = [];

for (let i = 0; i < 50; i++) {
  const idx = i % 5;
  events.push({
    device_id: devices[idx],
    timestamp: new Date(Date.now() - i * 3600000),
    temperature: 25.0 + (i % 10) * 0.7,
    humidity: 55.0 + (i % 8) * 1.5,
    location: locations[idx]
  });
}

db.events.insertMany(events);
print("✅ 50 événements insérés !");
print("Total: " + db.events.countDocuments());
