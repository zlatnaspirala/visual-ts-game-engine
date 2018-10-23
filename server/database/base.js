


let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017";

class MyDatabase {

  constructor() {
    console.warn("GOOD");
  }

  register(user) {

    MongoClient.connect(url, { useNewUrlParser: true }, function (error, db) {
      if (error) {
        console.warn(error);
        return;
      }

      const dbo = db.db("masterdatabase");
      if (!dbo.collection("users")) {
        dbo.createCollection("users").createIndex({ "email": 1 }, { unique: true });
      }

      dbo.collection("users").findOne({ "email": user.email }, function (err, result) {

        if (err) {
          console.log("err:" + err);
          return;
        }

        if (result == null) {
          dbo.collection("users").insertOne({ "email": user.email, "password": user.password }, function (err, res) {
            if (err) {
              console.log("err:" + err);
              db.close();
              return;
            }
            console.log("success", res.ops);
            console.log("User registred.");
            db.close();
          });
        } else {
          console.log("User already registred!");
          db.close();
        }

      });
    });

  }
}

let userInput = { email: "zlatnaspirala@gmail.com", password: "qwqwqw" };
let test = new MyDatabase();
test.register(userInput);
