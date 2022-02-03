let DB_URI =
  "mongodb://admin:@mongodb-testing.default.svc.cluster.local:27017/books"; //"mongodb://20.105.122.225:27017/books"; //"mongodb://mongodb-service:27017/books"; //"mongodb://mongodb-testing.default.svc.cluster.local/books"; //"mongodb://10.244.0.14:27017/books"; //"mongodb://localhost:27017/books";

if (process.env.MONGO_DB_URI) {
  DB_URI = process.env.MONGO_DB_URI;
}

module.exports = {
  DB_URI,
};
