const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/todos';

module.exports = function (app) {
  MongoClient.connect(url, function (err, db) {
    app.database = db
  })
};
