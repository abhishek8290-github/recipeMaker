const { MongoClient } = require("mongodb");

const mongoose = require('mongoose');





const uri = process.env.ATLAS_URI || "";
const logger = require('../middleware/logger');

let conn;
const get_mongo_client = async () => {
    try {
        conn = mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        return conn
    } catch (err) {
        logger.log(err.stack);
    }
};




module.exports = {
    get_mongo_client
};