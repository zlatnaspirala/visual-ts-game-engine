let MongoClient = require("mongodb").MongoClient;
const shared = require("./../common/shared");

/**
 * MyDatabase class
 * MongoDB Database used in this project.
 * JavaScript fullstack project
 */
class MyDatabase {

  constructor(serverConfig) {

    this.config = serverConfig;

    var PlatformerActiveUsers = require("../data-serve/platformer/class/activeplayers");
    this.platformerActiveUsers = new PlatformerActiveUsers(this.config);

    var ActiveVisitors = require("../data-serve/visitors/activevisitors");
    this.activeVisitors = new ActiveVisitors(this.config);

    /*
    this.dataServeModules = [];
    dataServeModules.forEach(function(myClass) {
      var instance = new myClass(serverConfig);
      root.dataServeModules.push(instance);
      console.log("<<<<INSTANCE<<<<<<<<<<<<<<<<<<<")
    });
    */

  }

  /**
   * Method register is called on singup user action.
   * @param {object} user
   *  email: user.userRegData.email
   *  user.userRegData.password
   * @param {classInstance} callerInstance
   */
  register(user, callerInstance) {

    var root = this;

    /**
     * This line prevents method register
     * to be used by others classes.
     * Connector class is allowed.
     */
    if(callerInstance.constructor.name !== "Connector") {
      console.error("Potencial Critical Hack Attack");
      return;
    }

    const databaseName = this.config.databaseName;

    /**
    * Open connection with database.
    */
    MongoClient.connect(this.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {
        console.warn("MyDatabase : err1:" + error);
        return;
      }

      const dbo = db.db(databaseName);
      if(!dbo.collection("users")) {
        dbo.createCollection("users").createIndex({"email": 1}, {unique: true});
        dbo.createCollection("users").createIndex({"password": 1}, {unique: true});
        dbo.createCollection("users").createIndex({"socketid": 1}, {unique: true});
        dbo.createCollection("users").createIndex({"confirmed": 1}, {unique: true});
        dbo.createCollection("users").createIndex({"token": 1}, {unique: true});
        dbo.createCollection("users").createIndex({"online": 1}, {unique: false});
        dbo.createCollection("users").createIndex({"nickname": 1}, {unique: false});
        dbo.createCollection("users").createIndex({"points": 1}, {unique: false});
      }

      dbo.collection("users").findOne({"email": user.userRegData.email}, function(err, result) {

        if(err) {console.log("MyDatabase err2:" + err); return null;}

        if(result === null) {

          let uniqLocal = shared.generateToken();

          dbo.collection("users").insertOne({
            email: user.userRegData.email,
            password: callerInstance.crypto.encrypt(user.userRegData.password),
            nickname: "no-nick-name" + shared.getDefaultNickName(),
            confirmed: false,
            token: uniqLocal,
            socketid: user.socketId,
            online: false,
            points: 1000,
            rank: "junior"
          }, function(err, res) {
            if(err) {
              console.log("MyDatabase err3:" + err);
              db.close();
              return;
            }
            callerInstance.onRegisterResponse("USER_REGISTERED", res.ops[0].email, res.ops[0].token, res.ops[0].socketid, callerInstance);
            db.close();
          });
        } else {
          callerInstance.onRegisterResponse("USER_ALREADY_REGISTERED", user.userRegData.email, null, user.socketId, callerInstance);
          db.close();
        }

      });
    });

  }

  regValidator(user, callerInstance) {

    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {
        console.warn("MyDatabase : err1:" + error);
        return;
      }
      const dbo = db.db(databaseName);
      dbo.collection("users").findOne({email: user.email, token: user.token}, function(err, result) {
        if(err) {
          console.log("MyDatabase.regValidator 2:" + err);
          return null;
        }
        if(result !== null) {
          dbo.collection("users").updateOne(
            {email: user.email, },
            {$set: {confirmed: true, points: 1000}},
            function(err, result) {
              if(err) {
                console.warn("MyDatabase, update confirmed err :" + err);
                callerInstance.onRegValidationResponse(null, user.email, user.accessToken);
                return;
              }
              console.warn("MyDatabase, update confirmed result:" + result);
              callerInstance.onRegValidationResponse(result, user.email, user.accessToken);
              db.close();
            }
          );
        } else {
          callerInstance.onRegValidationResponse(result, user.email, user.accessToken);
          db.close();
        }
      });
    });
  }

  loginUser(user, callerInstance) {

    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(err, db) {
      if(err) {console.warn("Login err:" + err); return;}
      const dbo = db.db(databaseName);
      console.warn("MyDatabase.login:" + user);
      dbo.collection("users").findOne({email: user.email, confirmed: true}, {},
        function(err, result) {
          if(err) {console.log("MyDatabase.login :" + err); return null;}
          if(result !== null) {
            // Secure
            const pass = callerInstance.crypto.decrypt(result.password);
            if(pass == user.password) {
              console.warn("Session passed...");
            } else {
              console.warn("Session : Bad cert return");
              db.close();
              return;
            }
            // Security staff
            const userData = {
              email: result.email,
              nickname: result.nickname,
              points: result.points,
              rank: result.rank,
              token: result.token,
            };

            dbo.collection("users").updateOne(
              {email: user.email, },
              {$set: {online: true, socketId: user.socketId}},
              function(err, result) {
                if(err) {console.log("login.user err update one:"); return;}
                console.warn("ONLINE: ", userData.nickname);
                callerInstance.onUserLogin(userData, callerInstance);
                db.close();
              });
          } else {
            db.close();
          }
        });
    });

  }

  getUserData(user, callerInstance) {
    // test
    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      function(error, db) {
        if(error) {console.warn("MyDatabase.getUserData err:" + error); return;}
        const dbo = db.db(databaseName);
        dbo.collection("users").findOne({token: user.data.token, online: true, confirmed: true},
          function(err, result) {
            if(err) {console.log("MyDatabase.getUserData :" + err); return null;}
            if(result !== null) {
              // Security staff
              const userData = {
                email: result.email,
                points: result.points,
                rank: result.rank,
                nickname: result.nickname,
                socketid: result.accessToken,
                token: result.token
              };
              callerInstance.onUserData(userData, callerInstance);
              db.close();
            } else {
              db.close();
            }
          });
      });
  }

  setNewNickname(user, callerInstance) {
    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {console.warn("MyDatabase.login :" + error); return;}
      const dbo = db.db(databaseName);
      dbo.collection("users").findOne({socketid: user.data.accessToken, online: true, confirmed: true},
        function(err, result) {
          if(err) {console.log("MyDatabase.setNewNickname (user socket id not found):" + err); return null;}
          if(result !== null) {
            const userData = {
              accessToken: user.data.accessToken,
              newNickname: user.data.newNickname,
              email: user.data.email
            };
            dbo.collection("users").updateOne(
              {email: user.data.email, },
              {$set: {nickname: user.data.newNickname}},
              function(err, result2) {
                if(err) {
                  console.log("MyDatabase.setNewNickname (error in update):", err);
                  return;
                }
                callerInstance.onUserNewNickname(userData, callerInstance);
                db.close();
              }
            );
          } else {
            db.close();
          }
        });
    });
  }

  fastLogin(user, callerInstance) {
    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {console.warn("MyDatabase.login error:" + error); return;}
      const dbo = db.db(databaseName);
      dbo.collection("users").findOne({email: user.data.userLoginData.email, token: user.data.userLoginData.token, confirmed: true},
        function(err, result) {
          if(err) {console.log("MyDatabase.login :" + err); return null;}
          if(result !== null) {
            // Security staff
            const userData = {
              email: result.email,
              nickname: result.nickname,
              points: result.points,
              rank: result.rank,
              token: result.token,
            };
            dbo.collection("users").updateOne(
              {email: user.data.userLoginData.email, },
              {$set: {online: true, socketId: user.socketId}},
              function(err, result) {
                if(err) {console.log("FASTLOGIN err:", err); return;}
                console.warn("ONLINE: ", userData.nickname);
                callerInstance.onUserLogin(userData, callerInstance);
                db.close();
              }
            );
          } else {
            db.close();
          }
        });
    });
  }

  logOut(user, callerInstance) {
    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {console.warn("MyDatabase.logout err:" + error); return;}
      const dbo = db.db(databaseName);
      dbo.collection("users").findOne({token: user.data.token, confirmed: true},
        function(err, result) {
          if(err) {console.log("MyDatabase.logout err:" + err); return null;}
          if(result !== null) {
            // Security staff
            const userData = {
              email: result.email,
              nickname: result.nickname,
              points: result.points,
              rank: result.rank,
              token: result.token,
            };
            dbo.collection("users").updateOne(
              {email: userData.email, },
              {$set: {online: false}},
              function(err, result) {
                if(err) {console.log("logout err:!"); return;}
                console.warn("logout : ", userData.nickname);
                callerInstance.onLogOutResponse(userData, callerInstance);
                db.close();
              }
            );
          } else {
            db.close();
          }
        });
    });
  }

}
module.exports = MyDatabase;
