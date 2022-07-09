const dbConfig = require("../db/db.config.js");
const {song,artist,album,featured} = require("./tables.js");
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

    db.artists = artist(sequelize, Sequelize);
    db.albums = album(sequelize, Sequelize);
    db.songs = song(sequelize, Sequelize);
    db.features = featured(sequelize, Sequelize);
  
//associations
db.albums.hasMany(
    db.songs, {
    targetKey: 'id',
    foreignKey: 'album_id',
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION'
  }
);
db.artists.hasMany(
    db.albums, {
      onDelete: 'SET NULL',
      onUpdate: 'NO ACTION',
    foreignKey: 'artist_id',
  }
);
db.songs.belongsTo(
    db.albums, {
    targetKey:'id',
    foreignKey:'album_id'
  }
);
db.albums.belongsTo(
    db.artists, {
      targetKey:'id',
    foreignKey:'artist_id'
  }
);

db.features.hasMany(
  db.albums
);
db.features.hasMany(
  db.artists
);



module.exports = db;