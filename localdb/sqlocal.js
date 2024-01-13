const sqlite = require('sqlite3').verbose();
const path = require('path');


class localdb {
    _db = new sqlite.Database(path.resolve(__dirname, 'node-rest-shop.db'), sqlite.OPEN_READWRITE, (err) => {
        if(err) return console.error(err, path.resolve(__dirname, 'rest.db'));

        console.log('succesfully connected to Database.');
    });

    WriteToDB (sql, data, callback) {
        
        this._db.run(sql, data, function (err) {
            if(err) callback (err);

            console.log("successfully writing to Database");
            callback(null);
        });
    };
   
}


// const getDatabasePath = () => {
//     return path.resolve(__dirname, 'node-rest-shop.db');
// }

module.exports = localdb;