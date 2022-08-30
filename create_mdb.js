var MongoClient = require('mongodb').MongoClient;

// a script to create a mongodb database and collection
// use once for installetion

const port = 27017
const database = "flights"
const collection = "historical"

async function create_mdb(){
  var url = `mongodb://0.0.0.0:${port}/${database}`;
  await MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Mongodb: Database created!");
    db.close();
  });

  url = `mongodb://0.0.0.0:${port}`;

  await MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.createCollection(collection, function(err, res) {
      if (err) throw err;
      console.log("Mongodb: Collection created!");
      db.close();
    });
  });
}

create_mdb();


