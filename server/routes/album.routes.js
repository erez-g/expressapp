module.exports = app => {
    const albums = require("../models/album.controller.js");
    var router = require("express").Router();
    
    // Create a new song
    router.post("/", albums.create);
    
    // Retrieve albums with name query
    router.get("/", albums.findAll);
    
    // Retrieve a single song with id
    router.get("/:id", albums.findOne);
    
    // Update a song with id
    router.put("/:id", albums.update);
    
    // Delete a song with id
    router.delete("/:id", albums.delete);
    
    // Delete all albums
    router.delete("/", albums.deleteAll);

    app.use('/api/albums', router);

}

