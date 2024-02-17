const {dbArg} = require("../../common/shared");
let MongoClient = require("mongodb").MongoClient;

/**
 * @description 
 * Simple visitors logs
 */
class ActiveVisitors {

  constructor(config) {
    this.config = config;
    MongoClient.connect(config.getDatabaseRoot, dbArg, function(err, db) {
      if(err) {console.warn("active visitors:" + err); return;}
      const dbo = db.db(config.databaseName)
      dbo.listCollections().toArray(function(err, data) {
        data.forEach(function(item) {
          console.log("List :", item.name)
        })
      })

      if(!dbo.collection("visitors")) {
        dbo.createCollection("visitors", function(err, collection) {
          if(err) throw err;
          collection.createIndex({"browser": 1}, {unique: false});
          collection.createIndex({"userAgent": 1}, {unique: false});
          db.close()
        })
      }
    })
  }

  addVisitor(arg, callerInstance) {
    var root = this;
    console.log("VISITORS");
    const databaseName = callerInstance.config.databaseName;
    MongoClient.connect(callerInstance.config.getDatabaseRoot, dbArg, function(err, db) {
      if(err) {console.warn("visitors:" + err); return;}
      const dbo = db.db(databaseName);
      dbo.collection("visitors").insertOne({
        userAgent: arg.data.useragent,
        browser: arg.data.browser
      }, function(err, result) {
        if(err) {console.log(err); db.close(); return;}
        if(result) {
          console.log(" NEW VISITORS ! ");
        }
        db.close();
      });
    });
  }
}

module.exports = ActiveVisitors;