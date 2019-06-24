
class PlatformerActiveUsers  {

  constructor(config) {
    this.config = config;
    constructTable(config);
  }

  constructTable(config) {
    const dbo = db.db(config.databaseName);
    if (!dbo.collection("platformer-au")) {
      dbo.createCollection("platformer-au").createIndex({ "token": 1 }, { unique: true });
      dbo.createCollection("platformer-au").createIndex({ "rank": 1 }, { unique: true });
      dbo.createCollection("platformer-au").createIndex({ "nickname": 1 }, { unique: true });
    }
  }

  addActiveGamePlayer(user, callerInstance) {

    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, { useNewUrlParser: true }, function(error, db) {
      if (error) {
        console.warn("ActiveGame err:" + error);
        return;
      }

      const dbo = db.db(databaseName);
      dbo.collection("platformer").findOne({ token: user.token },
        function(err, result) {
          if (err) {
            console.log("ActiveGame.addActiveGame (err1):" + err);

            dbo.collection("active-games").insertOne({
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
            console.log("ActiveGame.addActiveGame (User have open game already, disallow to play any game more):" + err);
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
}
module.exports = PlatformerActiveUsers;
