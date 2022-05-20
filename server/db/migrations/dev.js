const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function getData(file) {
    return new Promise( (resolve) => {
        const arr = [];
        let regExNamingScheme = new RegExp('[^._]([a-z])+([^s.])');
        let tableName = file.substr(file.lastIndexOf('/')+1).match(regExNamingScheme);
        
        if (tableName) tableName = tableName[0];
            else return;
        const controllers = require(path.join(__dirname,
                '/../../models/' + tableName + 
                '.controller.js'
        ));
        
        //this doesn't really work when chaining res.status(###).send({msg:msg})
        resObj = {status:(code) => {return code;},
            send: (txt) => {return txt;}
        };

        fs.createReadStream(file)
            .pipe(csv())
            .on('data',  (row) => {
                //future
                
                console.log(row);
                if (row.album_id) row.album_id = +row.album_id;
                if (row.artist_id) row.artist_id = +row.artist_id;

                const reqObj = {body: row};
                arr.push(reqObj);
            }).on('end', async () => {
            
            // console.log('done CSV, ' + arr.length + ' rows.');
            for await (const reqObj of arr) {
                controllers.create(reqObj,resObj)
            }
            resolve(arr);
        });
    })
}

  module.exports.getData = getData;
