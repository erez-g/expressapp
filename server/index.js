// const path = require('path');
const cors = require('cors');
const express = require("express");
const app = express();
const errorMiddleware = require('./routes/errorMiddleware');

app.use(express.json());

const db = require('./models/init.js');
db.sequelize.sync();

app.use(cors());
require("./routes/song.routes.js")(app);
require("./routes/artist.routes.js")(app);
const PORT = process.env.PORT || 3001;

// app.get("/api", (req, res) => {
//   res.json({message: `HIYA from server! port ${PORT}.`});
// })

app.get("/", (req, res) => {
  res.json({message: "Hello from server!"});
})

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
  try {
   db.sequelize.authenticate();
    console.log('all good');
  } catch (error) {
    console.log('whoopsies ', error);
  }
});
