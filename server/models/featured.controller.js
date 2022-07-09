// const res = require("express/lib/response");
const db = require("../models/init.js");
const Featured = db.features;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;


//create and save new featured
exports.create = (req, res) => {
    // if (!req.body.name) {
    //     res.status(400).send({message: "featured must have a name"});
    //     return;
    // }
    // //mutate request to search existing value first
    //this creates a gateway timeout and crashes the client
    // let existingRecord = Featured.findAll(req, res)
    // if (existingRecord) {
    //   console.log('found');
    //   res.status(201).send({message: 'record exists'});
    //   return false;
    // } 
    const featured = {
        name: req.body.name
    };
    if (req.body.id)//used by migration
      featured.id = req.body.id;
    
    Featured.create(featured)
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

//get all featureds with condition
exports.findAll = async (query) => {
  const {searchTerm, limit, offset, sortDir, sortField} = query;    
  
  const queryOptions = {
    attributes: ['id','name'],
    limit: +limit,
    offset: +offset
  };
  switch (sortField) {
      case 'featured':
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
    const result = await Featured.findAndCountAll(queryOptions);
    return result;
  } catch(e) {
    throw createError(400, e.message);
  }
};

//get featured by id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Featured.findByPk(id)
        .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
            message: `Cannot find Featured with id=${id}.`
            });
        }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Featured with id=" + id
            });
        });
};

// Update a featured
exports.update = (req, res) => {
    const id = req.params.id;
    Featured.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Featured was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update featured with id=${id}. Maybe featured was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating featured with id=" + id
        });
      });
  };

// Delete featured
exports.delete = (req, res) => {
    const id = req.params.id;
    Featured.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "featured was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete featured with id=${id}. Maybe featured was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete featured with id=" + id
        });
      });
  };

// Delete all featureds
exports.deleteAll = (req, res) => {
    Featured.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} featureds were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all featureds."
        });
      });
  };

exports.getAllByFeatured = (req, res) => {
    if (!req.params.featured_id) {
        res.status(400).send({message: "no featured id"});        
        return;
    }
    Featured.findAll({ where:{featured_id: req.params.featured_id} })
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