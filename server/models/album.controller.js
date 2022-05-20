// const res = require("express/lib/response");
const db = require("../models/init.js");
const { album } = require("./tables.js");
const Album = db.albums;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

const createError = (status, msg) => {
  let err = new Error(msg || 'bad request');
  err.status = status || 500;
  return err;
}

//create and save new album
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({message: "album must have a title"});
        return;
    }
    // console.log(req.body);
    const album = {
        name: req.body.name,
        artist_id: req.body.artist_id,
    };
    if (req.body.id)//used by migration
    album.id = req.body.id;

    Album.create(album)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                err.message || 'no specific error message.'
            });
        });
};

// exports.findAll = (query) => {

//   console.log('find all query params', query);

//   throw createError(400, 'some error');
// }

// get all albums with condition
exports.findAll = async (query) => {
  console.log('***********************')
  console.log('***********************')
  console.log(query)
  console.log('***********************')
  console.log('***********************')
    // const searchTerm = query.searchTerm;
    // const limit = +(query.limit) || false;
    // const offset = +(query.offset) || 0;

    const {searchTerm, limit, offset} = query;
    
    const fields = ['id'];
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
      [sequelize.literal("`album->artist`.`id`"), 'artist_id']
      ],
      limit: +limit,
      offset: +offset
    };
    switch (query.sortField) {
      case 'artist':
        queryOptions.order = ['artist_name'];
        break;
        case 'album':
        queryOptions.order = ['name'];
        break;
      default: //nothing
      queryOptions.order = ['id'];
    }
    const condition = searchTerm ? {[Op.like]: `%${searchTerm}%` } : null;
    
    queryOptions.where = condition ? 
      {[Op.or]:[
        {'name': condition}
      ]} : null;

      //alias
      const artistName = sequelize.literal("`album->artist`.`name`");

    // if (queryOptions.where) {
    //   console.log(Object.keys(queryOptions.where)[0]);
    //   queryOptions.where[Op.or].push(artistNameCondition);
    // }
    console.log(queryOptions.where);
    queryOptions.order[1] = req.query.sortDir;
    queryOptions.order = sequelize.literal(queryOptions.order.join(" "));

    try {
      const result = await Album.findAndCountAll(queryOptions);
      // console.log('result', result)
      return result
    } catch(e) {
      throw createError(400, e.message);
    }
        // .then(data => {
        //   res.send(data);
        // })
        // .catch(err => {
        //     res.status(500).send({
        //         message:
        //         err.message || 'no specific error message.'
        //     });
        // });
};




// exports.findAll = (req, res) => {
//     const name = req.query.name;
//     const fields = req.query.fields.split(',');
//     // const fields = ['id'];
//     const condition = name ? {[Op.like]: `%{name}%` } : null;
//     Album.findAndCountAll({
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

//get album by id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Album.findByPk(id)
        .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
            message: `Cannot find Album with id=${id}.`
            });
        }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Album with id=" + id
            });
        });
};

// Update an album
exports.update = (req, res) => {
    const id = req.params.id;
    Album.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Album was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update album with id=${id}. Maybe album was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating album with id=" + id
        });
      });
  };

// Delete album
exports.delete = (req, res) => {
    const id = req.params.id;
    Album.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "album was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete album with id=${id}. Maybe album was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete album with id=" + id
        });
      });
  };

// Delete all albums
exports.deleteAll = (req, res) => {
    Album.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} albums were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all albums."
        });
      });
  };

exports.getAllByArtist = (req, res) => {
    if (!req.params.artist_id) {
        res.status(400).send({message: "no artist id"});        
        return;
    }
    Album.findAll({ where:{artist_id: req.params.artist_id} })
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