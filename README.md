# navy-hackaton

## how to run

* go to `kafka` folder and run `docker compose up -d` to load up kafka and redis
* go to `data` folder and run  `./feed-to-kafka.sh tracker1.json` to load the data to kafka
* go to `recorder` folder and run `npm i` then `npm start` to load up the entities snapshot to redis
* start the playback server in the folder `playback-rest-api` with `npm i` then `npm start`
* start cesium client in the folder `cesium-playback` with `npm i` then `npm start`