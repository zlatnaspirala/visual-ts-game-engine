
### Prepare server for running: ###

javascript
```
npm install
```

  Fix and report if something missing in dependency.

### Run data/media server based on MultiRTC2.2 vs socket.io : ###

javascript
```
npm run rtc
```

  You can use this server also for video-chat it is already implemented.
It is still better to use 'npm run broadcaster' for video chat. I use this server
for data communication and session staff also any other use...

### Run data/media server based on MultiRTC3 PTP: ###

  For now broadcaster use 'server\broadcaster-config.json' for input data.
 This will be replaced with uniq server config file.

  Features comes with broadcaster:

 - Multiplatform video chat works with other hybrid frameworks or custom implementation throw the native
   mobile application web control (Chrome implementation usually).

 - Implemented dragable video containers.

```javascript
  npm run broadcaster
```

### Install MongoDB follow link: ###

 [Install mongoDB](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-centos-7)

  If you wanna deploy database & server code on same host (without chanse for remote connection)
then use next setup:

javascript
```
  this.databaseRoot = "mongodb://localhost:27017";
```

 Must be in samo folder or input full path to the data folder.
 Run :

javascript
```
  mongod --dbpath data
```

  - Deploy mongo on public server looks like:

javascript
```
  this.databaseRoot = "mongodb://DOMAIN:27017";

  or

  this.databaseRoot = "mongodb://IPADDRESS:27017";
```

javascript
```
  mongod --dbpath data --bind_ip <IPADDRESS>
```

 or

javascript
```
  mongod --dbpath data --bind_ip <DOMAIN>
```

 After running database mongo service you can use :

```
  mongo --host maximumroulette.com:27017
```

 to connect with mongo terminal.

  Basic commands :

```
   show dbs

   use <database_name>

   db.dropDatabase()

```

 Adding password :

 Start mongod normally.

 Attach mongo console :

```
  mongo --host maximumroulette.com --port 27017
```
 Then exec this :

```
use admin
 db.createUser({
   user: "userAdmin",
   pwd: "*****",
   roles: [ { role: "userAdminAnyDatabase", db: "admin"}, "readWriteAnyDatabase"]})
```

Restart mongod with :

```
mongod --auth --dbpath data --bind_ip maximumroulette.com
```

Next attach will be :

```
 mongo --host maximumroulette.com --port 27017 -u "userAdmin" --authenticationDatabase "admin" -p
```


Source :

https://docs.mongodb.com/manual/tutorial/enable-authentication/

