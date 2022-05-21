module.exports = app => {
    const artists = require("../models/artist.controller.js");
    var router = require("express").Router();
    
    const sendResponse = (res, result) => {
        return res.json({ success: true, result });
    }

    // Create a new song
    router.post("/", artists.create);
    
    // Retrieve albums with name query
    router.get("/", (req, res, next) => {
        let { query } = req;
        
        return artists.findAll(query).then((result) => {
            return sendResponse(res, result)
        }).catch(next);
    });
    
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

