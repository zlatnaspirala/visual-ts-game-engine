let MongoClient = require("mongodb").MongoClient;

class PlatformerActiveUsers {

  constructor(config) {

    this.config = config;

    console.log(">>config.getDatabaseRoot>>", config.getDatabaseRoot)

    MongoClient.connect(config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {
        console.warn("MyDatabase activeplayers : err:" + error);
        return;
      }

      const dbo = db.db(config.databaseName);

      dbo.listCollections().toArray(function(err, data) {
        data.forEach(function(item) {
          console.log("List :", item.name);
        })
      });

      if(!dbo.collection("platformer")) {

        dbo.createCollection("platformer", function(err, collection) {

          if(err) throw err;
          collection.createIndex({"token": 1}, {unique: true});
          collection.createIndex({"rank": 1}, {unique: false});
          collection.createIndex({"nickname": 1}, {unique: false});
          collection.createIndex({"lives": 3}, {unique: false});
          collection.createIndex({"channelID": 3}, {unique: false});
          db.close();

        });

      }

    });

  }

  addActiveGamePlayer(user, callerInstance) {

    var root = this;
    var gameID;
    if(typeof user.data.gameName === 'undefined') {
      console.log("user.gameName is undefined");
      gameID = "platformer";
    } else {
      gameID = user.data.gameName;
      console.log("GOOD game name is", user.data.gameName);
    }

    const databaseName = callerInstance.config.databaseName;
    MongoClient.connect(callerInstance.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {
        console.warn("addActiveGamePlayer err:" + error);
        return;
      }
      const dbo = db.db(databaseName);
      if(!dbo.collection(gameID)) {console.log("Very bad 0003:: There is no active game collection", gameID)}

      dbo.collection(gameID).findOne({token: user.data.token},
        function(err, result) {
          if(err) {
            console.log("addActiveGamePlayer err : " + err);
            return null;
          }
          if(result == null) {

            dbo.collection("users").findOne({token: user.data.token},
              function(err, result) {
                if(err) {console.log(err); return null;}
                if(result) {

                  const localUserData = {
                    email: result.email,
                    nickname: result.nickname,
                    activeGame: gameID
                  };

                  root.countPoints(user, callerInstance, 10);

                  dbo.collection(gameID).insertOne({
                    nickname: result.nickname,
                    token: result.token,
                    rank: result.rank,
                    points: result.points,
                    channelID: user.data.channelID
                  }, function(err, result) {
                    if(err) {console.log(err); db.close(); return;}
                    if(result) {
                      callerInstance.onGameStartResponse(localUserData, callerInstance);
                      console.log("Database data serve: Game started.");
                    }
                    db.close();
                  });

                } else {
                  db.close();
                }
              });

          } else {

            root.countPoints(user, callerInstance, 30);

            dbo.collection("users").findOne({token: user.data.token},
              (err, result) => {
                if(err) {return;}
                const localUserData = {
                  email: result.email,
                  nickname: result.nickname,
                  activeGame: "platformer"
                };
                callerInstance.onGameStartResponse(localUserData, callerInstance);
                console.log("onGameStartResponse", result);
                db.close();
              });

            console.log("=====================================================================================")
            console.log("ActiveGame.addActiveGame (User is already in game play , new enter -30 points) ");
            console.log("=====================================================================================")
            return null;

          }

        });

    });

  }

  removeActiveGamePlayer(user, callerInstance) {

    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {
        console.warn("ActiveGame.removeActiveGamePlayer err:" + error);
        return;
      }

      const dbo = db.db(databaseName);
      dbo.collection("platformer").findOne({token: user.data.token},
        function(err, result) {
          if(err) {
            console.log("ActiveGame.removeActiveGamePlayer (err1):" + err);
            return;
          }

          if(result !== null) {

            var myquery = {token: result.token};
            dbo.collection("platformer").deleteOne(myquery, function(err, obj) {
              if(err) throw err;
              // console.log(obj.result.n + " document(s) deleted.user.data.token", user.data.token);
              dbo.collection("users").findOne({token: user.data.token},
                function(err, result) {
                  if(err) {
                    console.log("ActiveGame.removeActiveGamePlayer (err1):" + err);
                    db.close();
                    return;
                  }

                  if(result !== null) {
                    var userData = {
                      email: result.email,
                    };
                    console.log("ActiveGame.removeActiveGamePlayer player removed: " + result.nickname);
                    callerInstance.onOutOfGameResponse(userData, callerInstance);
                    db.close();
                    return;
                  } else {
                    db.close();
                  }
                });
            });

          } else {
            db.close();
          }

        });

    });

  }

  countPoints(user, callerInstance, pay) {

    if (pay > 0) {
      console.log("POINTS PAY CANT BE > 0 FOR USER ", user.data.token)
      return;
    }
    const databaseName = callerInstance.config.databaseName;
    MongoClient.connect(callerInstance.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {
        console.warn("addActiveGamePlayer err:" + error);
        return;
      }
      const dbo = db.db(databaseName);

      dbo.collection("users").findOneAndUpdate(
        {token: user.data.token},
        {$inc: {points: -pay}},
        (err, doc, raw) => {
          /*Do something here*/
          console.log(" findOneAndUpdate err: ", doc);
          db.close();
        }
      );
    });

  }

}
module.exports = PlatformerActiveUsers;
