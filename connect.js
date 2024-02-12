const config = require("./config");
const { dbUrl } = config;
const { MongoClient } = require('mongodb');
const client = new MongoClient(config.dbUrl);

function connect() {
  try {
    //await client.connect();
    const db = client.db('burguer_queen'); // Reemplaza <NOMBRE_DB> por el nombre del db
    console.log('conctado');
    return db;
   
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };