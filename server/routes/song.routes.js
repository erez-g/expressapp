module.exports = app => {
    const songs = require("../models/song.controller.js");
    var router = require("express").Router();

    const sendResponse = (res, result) => {
        return res.json({ success: true, result });
    }

    // Create a new song
    router.post("/", songs.create);

    // Retrieve all songs
    router.get("/", (req, res, next) => {
        let { query } = req;

        return songs.findAll(query).then((result) => {
            return sendResponse(res, result)
        }).catch(next);
    });

    // Retrieve all published songs
    router.get("/artist", songs.getAllByArtist);

    // Retrieve a single song with id
    router.get("/:id", songs.findOne);

    // Update a song with id
    router.put("/:id", songs.update);

    // Delete a song with id
    router.delete("/:id", songs.delete);

    // Delete all songs
    router.delete("/", songs.deleteAll);

    app.use('/api/songs', router);

}