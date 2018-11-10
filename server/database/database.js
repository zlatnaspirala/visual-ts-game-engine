let MongoClient = require("mongodb").MongoClient;
const shared = require("./../common/shared");

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
        dbo.createCollection("users").createIndex({ "online": 1 }, { unique: true });
      }

      dbo.collection("users").findOne({ "email": user.email }, function(err, result) {

        if (err) { console.log("MyDatabase err2:" + err); return null; }

        if (result === null) {

          let uniqLocal = shared.generateToken();

          dbo.collection("users").insertOne({
            email: user.email,
            password: user.password,
            confirmed: false,
            token: uniqLocal,
            online: false,
            points: 0,
            rank: "junior"
          }, function(err, res) {
            if (err) {
              console.log("MyDatabase err3:" + err);
              db.close();
              return;
            }
            callerInstance.onRegisterResponse("USER_REGISTERED", res.ops[0].email, res.ops[0].token, callerInstance);
            db.close();
          });
        } else {
          callerInstance.onRegisterResponse("USER_ALREADY_REGISTERED", user.email, null, callerInstance);
          db.close();
        }

      });
    });

  }

  regValidator(user, callerInstance) {

    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, { useNewUrlParser: true }, function(error, db) {
      if (error) {
        console.warn("MyDatabase : err1:" + error);
        return;
      }

      const dbo = db.db(databaseName);

      dbo.collection("users").findOne({ email: user.email, token: user.token }, function(err, result) {

        if (err) {
          console.log("MyDatabase.regValidator 2:" + err);
          return null;
        }

        if (result !== null) {

          dbo.collection("users").updateOne(
            { email: user.email, },
            { $set: { confirmed: true, points: 1000 } },
            function(err, result) {
              if (err) {
                console.warn("MyDatabase, update confirmed err :" + err);
                callerInstance.onRegValidationResponse(null, user.email);
                return;
              }
              console.warn("MyDatabase, update confirmed result:" + result);
              callerInstance.onRegValidationResponse(result, user.email);
            }
          );
        } else {
          callerInstance.onRegValidationResponse(result, user.email);
        }

      });


    });

  }

  loginUser(user, callerInstance) {
    // test

    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, { useNewUrlParser: true }, function(error, db) {
      if (error) {
        console.warn("MyDatabase.login :" + error);
        return;
      }

      const dbo = db.db(databaseName);

      dbo.collection("users").findOne({ email: user.email, password: user.password, confirmed: true },
        function(err, result) {

          if (err) { console.log("MyDatabase.login :" + err); return null; }

          if (result !== null) {

            // Security staff
            const userData = {
              email: result.email,
              points: result.points,
              rank: result.rank,
            };

            dbo.collection("users").updateOne(
              { email: user.email, },
              { $set: { online: true } },
              function(err, result) {
                if (err) {
                  console.log("BAD_EMAIL_OR_PASSWORD");
                  return;
                }
                // console.warn("MyDatabase.login :" + err);
                console.warn("MyDatabase.login GOOD result:" + result);
                callerInstance.onUserLogin(userData, callerInstance);
              }
            );

          }

        });


    });


    console.log(this.user + "< user");
  }

}
module.exports = MyDatabase;
