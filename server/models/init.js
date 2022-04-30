const dbConfig = require("../db/db.config.js");
const {song,artist,album} = require("./tables.js");
const {Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });
  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;  
  
  db.songs = song(sequelize, Sequelize);
  db.artists = artist(sequelize, Sequelize);
  db.albums = album(sequelize, Sequelize);
  
//associations
db.albums.hasMany(
  db.songs, {
    foreignKey: 'album_id'
  }
);
db.artists.hasMany(
  db.albums, {
    foreignKey: 'artist_id'
  }
);
db.songs.belongsTo(db.albums, {foreignKey:'album_id'});
db.albums.belongsTo(db.artists, {foreignKey:'artist_id'});

module.exports = db;