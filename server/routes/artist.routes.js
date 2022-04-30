module.exports = app => {
    const artists = require("../models/artist.controller.js");
    var router = require("express").Router();
    
    // Create a new song
    router.post("/", artists.create);
    
    // Retrieve artists with name query
    router.get("/", artists.findAll);
    
    // Retrieve a single song with id
    router.get("/:id", artists.findOne);
    
    // Update a song with id
    router.put("/:id", artists.update);
    
    // Delete a song with id
    router.delete("/:id", artists.delete);
    
    // Delete all artists
    router.delete("/", artists.deleteAll);

    app.use('/api/artists', router);

}

