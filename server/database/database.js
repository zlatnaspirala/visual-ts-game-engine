let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017";

class MyDatabase {

  constructor(serverConfig) {

    const self = this;
    this.config = serverConfig;
    console.warn("Database mongoDB is constructed.");

  }

  register(user) {

    console.log("REGISTER IS CALLED");

    const databaseName = this.config.databaseName;
    MongoClient.connect(url, { useNewUrlParser: true }, function(error, db) {
      if (error) {
        console.warn("err1:" + error);
        return null;
      }

      const dbo = db.db(databaseName);
      if (!dbo.collection("users")) {
        dbo.createCollection("users").createIndex({ "email": 1 }, { unique: true });
        dbo.createCollection("users").createIndex({ "confirmed": 1 }, { unique: true });
      }

      dbo.collection("users").findOne({ "email": user.email }, function(err, result) {

        if (err) { console.log("err2:" + err); return null; }

        if (result == null) {
          dbo.collection("users").insertOne({ "email": user.email, "password": user.password, confirmed: false }, function(err, res) {
            if (err) {
              console.log("err3:" + err);
              db.close();
              return null;
            }
            console.log("success", res.ops);
            console.log("User registred.");
            return "!REGISTRED!";
            db.close();
          });
        } else {
          console.log("User already registred!");
          db.close();
        }

      });
    });


  }

  login(user) {
    // test
    console.log(this.user + "< user");
  }

}
module.exports = MyDatabase;
