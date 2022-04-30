// const res = require("express/lib/response");
const db = require("../models/init.js");
const { song } = require("./tables.js");
const Song = db.songs;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

const createError = (status, msg) => {
  let err = new Error(msg || 'bad request');
  err.status = status || 500;
  return err;
}


//create and save new song
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({message: "song must have a title"});
        return;
    }
    console.log(req.body);
    const song = {
        name: req.body.name,
        artist_id: req.body.artist_id,
        album_id: req.body.album_id
    };
    Song.create(song)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || 'no specific error message.'
            });
        });
};

exports.findAll = (query) => {

  console.log('find all query params', query);

  throw createError(400, 'some error');
}

// get all songs with condition
exports.findAll = (req, res) => {
    const searchTerm = req.query.searchTerm;
    const limit = +(req.query.limit) || false;
    const offset = +(req.query.offset) || 0;
    
    // const fields = ['id'];
    const queryOptions = {
      include: [
        {
          model: db.albums,
          attributes:[],
          include: [{
            model: db.artists
          }]
        }
      ],
      attributes: ['id','name',
      [sequelize.literal("`album->artist`.`name`"), 'artist_name'],
      [sequelize.literal("`album->artist`.`id`"), 'artist_id'],
        [sequelize.literal("`album`.`name`"), 'album_name'],
        [sequelize.literal("`album`.`id`"), 'album_id'],
      ],
      limit:limit,
      offset:offset
    };
    switch (req.query.sortField) {
      case 'artist':
        queryOptions.order = ['artist_name'];
        break;
        case 'album':
        queryOptions.order = ['album_name'];
        break;
      case 'song':
        queryOptions.order = ['name'];
        break;
      default: //nothing
      queryOptions.order = ['id'];
    }
    const condition = searchTerm ? {[Op.like]: `%${searchTerm}%` } : null;
    
    const artistName = sequelize.literal("`album->artist`.`name`");
    const artistCondition = {};
    artistCondition[artistName] = condition;

    queryOptions.where = condition ? 
      {[Op.or]:[
        {'name': condition},
        {'artist_name': condition} //doesnt work
      ]} : null;

      //alias

    // if (queryOptions.where) {
    //   console.log(Object.keys(queryOptions.where)[0]);
    //   queryOptions.where[Op.or].push(artistNameCondition);
    // }
    // console.log(queryOptions.where);
    queryOptions.order[1] = req.query.sortDir;
    queryOptions.order = sequelize.literal(queryOptions.order.join(" "));

    Song.findAndCountAll(queryOptions)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || 'no specific error message.'
            });
        });
};




// exports.findAll = (req, res) => {
//     const name = req.query.name;
//     const fields = req.query.fields.split(',');
//     // const fields = ['id'];
//     const condition = name ? {[Op.like]: `%{name}%` } : null;
//     Song.findAndCountAll({
//       attributes: fields,
//       where: condition
//     })
//         .then(data => {
//           res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                 err.message || 'no specific error message.'
//             });
//         });
// };

//get song by id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Song.findByPk(id)
        .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
            message: `Cannot find Song with id=${id}.`
            });
        }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Song with id=" + id
            });
        });
};

// Update a song
exports.update = (req, res) => {
    const id = req.params.id;
    Song.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Song was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update song with id=${id}. Maybe song was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating song with id=" + id
        });
      });
  };

// Delete song
exports.delete = (req, res) => {
    const id = req.params.id;
    Song.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "song was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete song with id=${id}. Maybe song was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete song with id=" + id
        });
      });
  };

// Delete all songs
exports.deleteAll = (req, res) => {
    Song.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} songs were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all songs."
        });
      });
  };

exports.getAllByArtist = (req, res) => {
    if (!req.params.artist_id) {
        res.status(400).send({message: "no artist id"});        
        return;
    }
    Song.findAll({ where:{artist_id: req.params.artist_id} })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "some error occured while getting records"
            })
        });
};