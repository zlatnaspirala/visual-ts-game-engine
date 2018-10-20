
let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017";

MongoClient.connect(url, function (error, db) {
  if (error) { throw error; }

  console.warn("Database created!");

  const dbo = db.db("masterdatabase");
  /*
  dbo.createCollection("users", function (err, res) {
    if (err) { throw err; }
    console.warn("Users collection created");
  });
*/
  db.close();
});
