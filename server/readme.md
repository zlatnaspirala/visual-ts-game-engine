
Prepare server for running:

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

mongod --dbpath data --bind_ip <IPADDRESS>
