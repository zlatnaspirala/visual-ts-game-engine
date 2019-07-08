let MongoClient = require("mongodb").MongoClient;

class PlatformerActiveUsers  {

  constructor(config) {

    this.config = config;

    MongoClient.connect(config.getDatabaseRoot, { useNewUrlParser: true }, function(error, db) {
      if (error) {
        console.warn("MyDatabase : err1:" + error);
        return;
      }

      const dbo = db.db(config.databaseName);

      dbo.listCollections().toArray(function(err, data) {
        data.forEach(function(item){
          console.log("List :", item.name);
        })
      });

      if (!dbo.collection("platformer")) {

      dbo.createCollection("platformer", function(err, collection) {

        if (err) throw err;
          collection.createIndex({ "token": 1 }, { unique: true });
          collection.createIndex({ "rank": 1 }, { unique: false });
          collection.createIndex({ "nickname": 1 }, { unique: false });
          collection.createIndex({ "lives": 3 }, { unique: false });
          db.close();

      });

    }

    });

  }

  addActiveGamePlayer(user, callerInstance) {

    var root = this;

    const databaseName = callerInstance.config.databaseName;
    MongoClient.connect(callerInstance.config.getDatabaseRoot, { useNewUrlParser: true }, function(error, db) {
      if (error) {
        console.warn("addActiveGamePlayer err:" + error);
        return;
      }
      const dbo = db.db(databaseName);

      console.log("New player user.data.token ", user.data.token);
      dbo.collection("platformer").findOne({ token: user.data.token },
        function(err, result) {
          if (err) {
            console.log("addActiveGamePlayer err : " + err);
            return null;
          }
          // console.log(result)
          if (result == null) {

            dbo.collection("users").findOne({ token: user.data.token },
              function(err, result) {
                if (err) {console.log(err); return null; }
                if (result) {

                  const localUserData = {
                    email: result.email,
                    nickname: result.nickname,
                    activeGame: "platformer"
                  };

                  root.countPoints(user, callerInstance, 10);

                  dbo.collection("platformer").insertOne({
                      nickname: result.nickname,
                      token: result.token,
                      rank: result.rank,
                      points: result.points
                    }, function(err, result) {
                      if (err) { console.log(err); db.close(); return; }
                      console.log("New player in game stage.");
                      if (result) {
                        callerInstance.onGameStartResponse(localUserData, callerInstance);
                        console.log("Database data serve: Game started");
                      }
                      db.close();
                    });

                }

              });

          } else {

            root.countPoints(user, callerInstance, 30);
            console.log("=====================================================================================")
            console.log("ActiveGame.addActiveGame (User is already in game play , new enter -30 points):" + err);
            console.log("=====================================================================================")
            return null;

          }

        });

    });

  }

  removeActiveGamePlayer(user, callerInstance) {

    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, { useNewUrlParser: true }, function(error, db) {
      if (error) {
        console.warn("ActiveGame err:" + error);
        return;
      }

      const dbo = db.db(databaseName);
      dbo.collection("platformer-au").findOne({ token: user.token },
        function(err, result) {
          if (err) {
            console.log("ActiveGame.removeActiveGamePlayer (err1):" + err);

            dbo.collection("platformer-au").insertOne({
              nickname: user.nickname,
              token: user.token,
              rank: rank
            }, function(err, result) {
              if (err) {
                console.log("ActiveGame err2:" + err);
                db.close();
                return;
              }
              console.log("ADDED NEW GAME", result);
              if (result) {
                console.log("ADDED NEW GAME", result);
              }
              // callerInstance.onRegisterResponse("USER_REGISTERED", callerInstance);
              db.close();
            });

            return null;
          }
          if (result !== null) {
            console.log("ActiveGame.platformer-au User have open game already:" + err);
            return null;
          }

        });

    });

  }

  countPoints(user, callerInstance, pay) {

    const databaseName = callerInstance.config.databaseName;
    MongoClient.connect(callerInstance.config.getDatabaseRoot, { useNewUrlParser: true }, function(error, db) {
      if (error) {
        console.warn("addActiveGamePlayer err:" + error);
        return;
      }
      const dbo = db.db(databaseName);

      dbo.collection("users").findOneAndUpdate(
        { token: user.data.token },
        { $inc: { points: -pay } },
      )

      // console.log("??????????user.data.token", user.data.token)
    });

  }

}
module.exports = PlatformerActiveUsers;
