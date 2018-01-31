const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

module.exports = function (app) {
  return async function (ctx, next) {
    await MongoClient.connect(url, function (err, db) {
      app.database = db.db('todos')
    })

    await next()
  };  
};
