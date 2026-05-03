use("iot_abidjan");

// Création collection devices avec validation
db.createCollection("devices", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["device_id", "type", "location", "status"],
      properties: {
        device_id: { bsonType: "string" },
        type: { bsonType: "string" },
        location: { bsonType: "string" },
        status: { bsonType: "string", enum: ["active", "inactive", "maintenance"] }
      }
    }
  }
});

// Création collection events avec validation
db.createCollection("events", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["device_id", "timestamp", "temperature", "humidity"],
      properties: {
        device_id: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        temperature: { bsonType: "double" },
        humidity: { bsonType: "double" }
      }
    }
  }
});

// Index sur devices
db.devices.createIndex({ device_id: 1 }, { unique: true });
db.devices.createIndex({ location: 1 });
db.devices.createIndex({ status: 1 });

// Index sur events
db.events.createIndex({ device_id: 1 });
db.events.createIndex({ timestamp: -1 });
db.events.createIndex({ device_id: 1, timestamp: -1 });

// Insertion 5 devices
db.devices.insertMany([
  { device_id: "ESP32_001", type: "DHT22", location: "cocody", status: "active" },
  { device_id: "ESP32_002", type: "DHT22", location: "plateau", status: "active" },
  { device_id: "ESP32_003", type: "DHT22", location: "yopougon", status: "inactive" },
  { device_id: "ESP32_004", type: "DHT22", location: "abobo", status: "active" },
  { device_id: "ESP32_005", type: "DHT22", location: "koumassi", status: "maintenance" }
]);

print("✅ Collections, index et devices créés avec succès !");
