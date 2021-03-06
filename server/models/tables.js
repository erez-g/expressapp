module.exports ={
    song: (sequelize, DataTypes) => {
        const Song = sequelize.define("song", {
            id: {
                type:DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            // artist_id: {
            //     type:DataTypes.INTEGER,
            //     allowNull:false
            // },
            album_id: {
                type:DataTypes.INTEGER,
                allowNull:true
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()')
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()')
            }
        
        
        },{underscored: true});
        return Song;
        // (async () => {
            // await Song.sync();
            //code
            
            // const newSong = Song.build({name: 'invaders', artist_id: 1, album_id: 1});
            // newSong.save();
            //^alternitavely could have used the shorthand await Song.create() for both
        // })();
        
        
        // console.log(newSong.toJSON());
    },
    artist: (sequelize, DataTypes) => {
        const Artist = sequelize.define("artist", {
            id: {
                type:DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            genre: {
                type: DataTypes.STRING,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()')
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()')
            }
        
        });
        return Artist;
    },
    album: (sequelize, DataTypes) => {
        const Album = sequelize.define("album", {
            id: {
                type:DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull:true
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()')
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()')
            }
        
        },{underscored: true});
        return Album;
    },
    featured: (sequelize, DataTypes) => {
        const Featured = sequelize.define("featured", {
            id: {
                type:DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()')
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()')
            }
        
        },{underscored: true});
        return Featured;
    }
}