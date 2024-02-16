let MongoClient = require("mongodb").MongoClient;

/**
 * @description 
 * Only active sessions
 * 
 */
class PlatformerActiveUsers {

  constructor(config) {
    this.config = config;
    MongoClient.connect(config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(err, db) {
      if(err) {console.warn("activeplayers:" + err); return;}
      const dbo = db.db(config.databaseName);

      dbo.listCollections().toArray(function(err, data) {
        data.forEach(function(item) {
          console.log("List :", item.name);
        })
      });

      if(!dbo.collection("platformer")) {
        dbo.createCollection("platformer", function(err, collection) {
          if(err) throw err;
          collection.createIndex({"rank": 1}, {unique: false});
          collection.createIndex({"nickname": 1}, {unique: false});
          collection.createIndex({"email": 1}, {unique: false});
          collection.createIndex({"channelID": 1}, {unique: false});
          db.close();
        })
      }
    })
  }

  addActiveGamePlayer(user, callerInstance) {
    var root = this;
    var gameID;
    if(typeof user.data.gameName === 'undefined') {
      console.log("user.gameName is undefined [deafult:platformer] ");
      gameID = "platformer";
    } else {
      gameID = user.data.gameName;
      console.log("GOOD game name is", user.data.gameName);
    }

    const databaseName = callerInstance.config.databaseName;
    MongoClient.connect(callerInstance.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(err, db) {
      if(err) {console.warn("addActiveGamePlayer." + err); return;}
      const dbo = db.db(databaseName);
      if(!dbo.collection(gameID)) {console.log("Very bad 0003:: There is no active game collection", gameID)}
      dbo.collection(gameID).findOne({token: user.data.token},
        function(err, result) {
          if(err) {console.log("addActiveGamePlayer.err : " + err); return null;}
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
                    email: result.email,
                    rank: result.rank,
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
            //
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
    }, function(err, db) {
      if(err) {console.warn("removeActiveGamePlayer:" + err); return;}
      const dbo = db.db(databaseName);
      dbo.collection("platformer").findOne({email: user.data.email},
        function(err, result) {
          if(err) {console.log("removeActiveGamePlayer:" + err); return;}
          if(result !== null) {
            var myquery = {email: result.email};
            dbo.collection("platformer").deleteOne(myquery, function(err, obj) {
              if(err) throw err;
              // console.log(obj.result.n + " document(s) deleted.user.data.token", user.data.token);
              dbo.collection("users").findOne({token: user.data.token},
                function(err, result) {
                  if(err) {
                    console.log("removeActiveGamePlayer:" + err);
                    db.close();
                    return;
                  }
                  if(result !== null) {
                    var userData = {
                      email: result.email,
                    };
                    console.log("removeActiveGamePlayer player removed: " + result.nickname);
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
        })
    })
  }

  quickRemoveActiveGamePlayer(keyEmail) {
    console.log('Q REMOVE From active - PLATFORMES ')
    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(err, db) {
      if(err) {console.warn("removeActiveGamePlayer:" + err); return;}
      const dbo = db.db(databaseName);
      console.warn("removeActiveGamePlayer  keyEmail.toString() :" + keyEmail.toString().length);
      // keyEmail = keyEmail.replace("→", "")
      keyEmail = keyEmail.slice(0,-1)
      console.warn("removeActiveGamePlayer  keyEmail.toString() :" + keyEmail.toString().length);
      dbo.collection("platformer").find({"email": keyEmail.toString()},
        function(err, result) {
          if(err) {console.log("removeActiveGamePlayer:" + err); return;}
          if(result !== null) {
            var myquery = {"email": keyEmail};
            dbo.collection("platformer").deleteMany(myquery, function(err, obj) {
              if(err) throw err;
              if(obj !== null) {
                console.log(obj.result.n + " document(s) deleted.user. ", keyEmail)
              }
              db.close()
            })
          } else {
            db.close()
          }
        })
    })
  }

  quickGetActiveGamePlayer(user, callerInstance) {
    console.log('GET From active - PLATFORMES ' , user)
    const databaseName = this.config.databaseName;
    MongoClient.connect(this.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(err, db) {
      if(err) {console.warn("removeActiveGamePlayer:" + err); return;}
      const dbo = db.db(databaseName);
      dbo.collection("platformer").find({}).toArray(function(err, result) {
        if(err) {
          console.log("error in get user list.");
          resolve({status: 'error in getUsers'})
        } else {
          var usersData = {
            status: "AUTHORIZED",
            email: user.data.email,
            users: []
          };
          console.log("get ActiveGamePlayer:", result)
          result.forEach(function(item, index) {
            var user = {};
            user.nickname = item.nickname;
            user.rank = item.rank;
            user.email = item.email;
            usersData.users.push(user);
          });
          callerInstance.onGetActiveListPlatformer(usersData, callerInstance);
          db.close();
        }
      })
    })
  }

  countPoints(user, callerInstance, pay) {

    if(pay < 0) {
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
          console.log(" findOneAndUpdate err: -pay ", -pay);
          db.close();
        }
      );
    });

  }

  plusPoints(user, callerInstance, p) {
    if(pay < 0) {
      console.log("POINTS PAY CANT BE < 0 FOR USER ", user.data.token)
      return;
    }
    const databaseName = callerInstance.config.databaseName;
    MongoClient.connect(callerInstance.config.getDatabaseRoot, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function(error, db) {
      if(error) {console.warn("addActiveGamePlayer err:" + error); return;}
      const dbo = db.db(databaseName);
      dbo.collection("users").findOneAndUpdate(
        {token: user.data.token},
        {$inc: {points: p}},
        (err, doc, raw) => {
          /*Do something here*/
          console.log(" findOneAndUpdate err: -pay ", p);
          db.close();
        }
      );
    });
  }

}
module.exports = PlatformerActiveUsers;
