const { Pool } = require('pg');
require('dotenv').config();

let instance = null;

class Database {
  constructor() {
    if (!instance) {
      this.pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      });
      instance = this;
      console.log('Connected to database.');
    }
    return instance;
  }

  query(text, params) {
    return this.pool.query(text, params);
  }
}

module.exports = new Database();
