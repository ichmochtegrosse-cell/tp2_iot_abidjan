use("iot_abidjan");

print("=== Q1 : Derniers événements par device ===");
db.events.find({ device_id: "ESP32_001" })
  .sort({ timestamp: -1 })
  .limit(1)
  .explain("executionStats")
  .queryPlanner.winningPlan;

print("\n=== Q2 : Moyenne température par location ===");
db.events.aggregate([
  { $group: { _id: "$location", avg_temp: { $avg: "$temperature" }, count: { $sum: 1 } } },
  { $sort: { avg_temp: -1 } }
]).toArray();

print("\n=== Q3 : Alertes température > 30°C ===");
db.events.find(
  { temperature: { $gt: 30 } },
  { device_id: 1, temperature: 1, timestamp: 1, location: 1 }
).sort({ temperature: -1 }).toArray();

print("\n=== Q4 : Devices actifs avec nb événements ===");
db.devices.aggregate([
  { $match: { status: "active" } },
  { $lookup: { from: "events", localField: "device_id", foreignField: "device_id", as: "events" } },
  { $project: { device_id: 1, location: 1, nb_events: { $size: "$events" } } }
]).toArray();

print("\n=== Q5 : Stats min/max/avg par device (24h) ===");
db.events.aggregate([
  { $match: { timestamp: { $gte: new Date(Date.now() - 86400000) } } },
  { $group: {
    _id: "$device_id",
    min_temp: { $min: "$temperature" },
    max_temp: { $max: "$temperature" },
    avg_temp: { $avg: "$temperature" },
    count: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
]).toArray();

print("\n✅ Requêtes Q1-Q5 exécutées !");
