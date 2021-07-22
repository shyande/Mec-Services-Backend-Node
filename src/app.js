const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const database = require('./database');

class App{
  constructor(){
    this.server = express();
    this.server.use(cors());
    this.middleware();
    this.routes();
  }
  middleware(){
    this.server.use(express.json());
  }
  routes(){
    this.server.use(routes);
  }
}
module.exports = new App().server;