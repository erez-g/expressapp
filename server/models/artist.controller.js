// const res = require("express/lib/response");
const db = require("../models/init.js");
const Artist = db.artists;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;


//create and save new artist
exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({message: "artist must have a name"});
        return;
    }
    // //mutate request to search existing value first
    //this creates a gateway timeout and crashes the client
    // let existingRecord = Artist.findAll(req, res)
    // if (existingRecord) {
    //   console.log('found');
    //   res.status(201).send({message: 'record exists'});
    //   return false;
    // } 
    const artist = {
        name: req.body.name
    };
    if (req.body.id)//used by migration
      artist.id = req.body.id;
    
    Artist.create(artist)
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

//get all artists with condition
exports.findAll = async (query) => {
  const {searchTerm, limit, offset, sortDir, sortField} = query;    
  
  const queryOptions = {
    attributes: ['id','name'],
    limit: +limit,
    offset: +offset
  };
  switch (sortField) {
      case 'artist':
      queryOptions.order = ['name'];
      break;
      //todo genre case
    default: //nothing
    queryOptions.order = ['id'];
  }
  const condition = searchTerm ? {[Op.like]: `%${searchTerm}%` } : null;
  
  queryOptions.where = condition ? 
    {[Op.or]:[
      {'name': condition}
    ]} : null;

  queryOptions.order[1] = sortDir;
  queryOptions.order = sequelize.literal(queryOptions.order.join(" "));

  try {
    const result = await Artist.findAndCountAll(queryOptions);
    return result;
  } catch(e) {
    throw createError(400, e.message);
  }
};

//get artist by id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Artist.findByPk(id)
        .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
            message: `Cannot find Artist with id=${id}.`
            });
        }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Artist with id=" + id
            });
        });
};

// Update a artist
exports.update = (req, res) => {
    const id = req.params.id;
    Artist.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Artist was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update artist with id=${id}. Maybe artist was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating artist with id=" + id
        });
      });
  };

// Delete artist
exports.delete = (req, res) => {
    const id = req.params.id;
    Artist.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "artist was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete artist with id=${id}. Maybe artist was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete artist with id=" + id
        });
      });
  };

// Delete all artists
exports.deleteAll = (req, res) => {
    Artist.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} artists were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all artists."
        });
      });
  };

exports.getAllByArtist = (req, res) => {
    if (!req.params.artist_id) {
        res.status(400).send({message: "no artist id"});        
        return;
    }
    Artist.findAll({ where:{artist_id: req.params.artist_id} })
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