const fs = require("fs");
const zlib = require("zlib");
const { EJSON } = require("bson");
const mongoose = require("mongoose");

(async () => {
  const backup = EJSON.parse(
    zlib.gunzipSync(
      fs.readFileSync("server/restore-test/orders.json.gz")
    ).toString()
  );

  const backupIds = new Set(backup.map(x => String(x._id)));

  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  const live = await db.collection("orders").find({}).toArray();

  const onlyProduction = live.filter(
    x => !backupIds.has(String(x._id))
  );

  console.log("Database:", db.databaseName);
  console.log("Backup orders:", backup.length);
  console.log("Production orders:", live.length);
  console.log("Chi co tren production:", onlyProduction);

  await mongoose.disconnect();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
