require('dotenv').config();

var Sequelize = require('sequelize')
var database = process.env.NODE_MUSIC_DB_DATABASE
var user = process.env.NODE_MUSIC_DB_USER
var password = process.env.NODE_MUSIC_DB_PASSWORD
var dbConn = new Sequelize(database, user, password, {
  host: process.env.NODE_MUSIC_DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    charset: 'utf8'
  }
});

var dbYoutube = dbConn.define('musics', {
  id: { type: Sequelize.STRING, primaryKey: true },
  source: { type: Sequelize.STRING },
  title: { type: Sequelize.STRING },
  filename: { type: Sequelize.STRING }
});
dbYoutube.sync();

module.exports.dbYoutube = dbYoutube;
