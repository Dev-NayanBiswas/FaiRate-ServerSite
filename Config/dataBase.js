const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// client.connect();

const dataBase = client.db("FaiRate");
const allReviews = dataBase.collection("AllReviews");
const services = dataBase.collection("AllServices");




module.exports = {
    allReviews,
    services,
}
