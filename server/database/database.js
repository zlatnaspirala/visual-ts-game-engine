let MongoClient = require("mongodb").MongoClient;

/**
 * MyDatabase class
 * MongoDB Database used in this project.
 * JavaScript fullstack project
 */
class MyDatabase {

  constructor(serverConfig) {

    const self = this;
    this.config = serverConfig;

  }

  /**
   * Method register is called on singup user action.
   * @param {object} user
   * @param {classInstance} callerInstance
   */
  register(user, callerInstance) {

    /**
     * This line prevents method register
     * to be used by others classes.
     * Connector class is allowed.
     */
    if (callerInstance.constructor.name !== "Connector") {
      console.error("Potencial Critical Secure Attack");
      return;
    }

    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, { useNewUrlParser: true }, function(error, db) {
      if (error) {
        console.warn("MyDatabase : err1:" + error);
        return;
      }

      const dbo = db.db(databaseName);
      if (!dbo.collection("users")) {
        dbo.createCollection("users").createIndex({ "email": 1 }, { unique: true });
        dbo.createCollection("users").createIndex({ "password": 1 }, { unique: true });
        dbo.createCollection("users").createIndex({ "confirmed": 1 }, { unique: true });
        dbo.createCollection("users").createIndex({ "token": 1 }, { unique: true });
      }

      dbo.collection("users").findOne({ "email": user.email }, function(err, result) {

        if (err) { console.log("MyDatabase err2:" + err); return null; }

        if (result == null) {
          dbo.collection("users").insertOne({ "email": user.email, "password": user.password, confirmed: false }, function(err, res) {
            if (err) {
              console.log("MyDatabase err3:" + err);
              db.close();
              return;
            }
            // console.log("success", res.ops);
            callerInstance.onRegisterResponse("USER_REGISTERED", res.ops[0].email);
            db.close();
          });
        } else {
          callerInstance.onRegisterResponse("USER_ALREADY_REGISTERED");
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
