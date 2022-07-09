const path = require('path');
const fs = require('fs');
const cors = require('cors');
const express = require("express");
const app = express();
const errorMiddleware = require('./routes/errorMiddleware');
const dataMigration = require('./db/migrations/dev.js');

app.use(express.json());

const db = require('./models/init.js');

db.sequelize.sync({force: true}).then(()=>{
  try {
      const files = fs.readdirSync(path.join(__dirname, 'db/seeders'));
      console.log(files)
      for (const file of files) {
        dataMigration.getData('server/db/seeders/' + file);
      }
  } catch (e) {
      console.log('error migrating data', e);
  }
});
app.use(cors());
require("./routes/song.routes.js")(app);
require("./routes/artist.routes.js")(app);
require("./routes/album.routes.js")(app);

const PORT = process.env.PORT || 3001;

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

