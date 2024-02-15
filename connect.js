const config = require("./config");
const { dbUrl } = config;
const { MongoClient } = require('mongodb');

const options = {connectTimeoutMS: 3000, socketTimeoutMS: 3000,serverSelectionTimeoutMS: 3000};
const client = new MongoClient(config.dbUrl, options);
function connect() {
  try {
    //await client.connect();
    const db = client.db('burguer_queen'); // Reemplaza <NOMBRE_DB> por el nombre del db
    console.log("Conetado a la bd burquer queen");
    return db;
   
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };