
let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017";

MongoClient.connect(url, { useNewUrlParser: true }, function (error, db) {
  if (error) {
    console.log(error);
    return;
  }

  const dbo = db.db("masterdatabase");
  if (!dbo.collection("users")) {
    dbo.createCollection("users");
  }


  var myCursor = dbo.getCollection("users").find({ "email": "122@gmzzzxail.com" }, function (err, item) {

    console.log("1111111111111111111111111111111111111111111", item);
  });

  /*
  console.warn("Database : " + dbo);

  dbo.collection("users").insertMany([{ "email": "122@gmzzzxail.com", "password": "a12655555556563456" },
  { "email": "nzsssssssxzxjn@gmzzzssssxail.com", "password": "a12655555556563456" }], function (err, res) {
    if (err) {
      // console.log("err:" + err);
      return;
    }

    console.log("success", res.ops);
    db.close();
  });

*/
  db.close();
});

