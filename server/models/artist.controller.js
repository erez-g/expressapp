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
exports.findAll = (req, res) => {
    const term = req.query.name.toLowerCase();
    // const fields = req.query.fields.split(',');
    // const fields = ['id'];
    const condition = { 
      name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + term + '%')       
    }// name: {[Op.like]: `%`+name+`%` }};
    if (!term) {
        res.status(400).send({message: "search by name"});
        return;
    }

    
    Artist.findAll({
      where: condition
    })
        .then(data => {
          console.log(data);
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