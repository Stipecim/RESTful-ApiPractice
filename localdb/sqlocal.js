const sqlite = require('sqlite3').verbose();
const path = require('path');


class localdb {
    _db = new sqlite.Database(path.resolve(__dirname, 'node-rest-shop.db'), sqlite.OPEN_READWRITE, (err) => {
        if(err) return console.error(err, path.resolve(__dirname, 'rest.db'));

        console.log('succesfully connected to Database.');
    });

    WriteToDB (sql, data, callback) {
        
        this._db.run(sql, data, function (err, obj) {
            if(err) callback (err, null);

            console.log("successfully writing to Database.");
            callback(null, obj);
        });
    };

    RreadFromDB(sql, data, callback) {
        this._db.get(sql, [data], function (err, obj) {
            if(err) callback(err, null);
            

            console.log("Succesfully read from Database.");
            callback(null, obj);
        });
    }

    ReadAllDB(sql, callback) {
        this._db.get(sql, function (err, rows) {})
        .all(sql, function (err, rows){
            if(err) callback(err, null);
            
            console.log("Succesfully read from Database.");
            callback(null, rows);
        });
    }
    
    DeleteFromDB(sql, id, callback) {
        this._db.run(sql, id, function (err) {
            if(err) callback (err);

            
            console.log(`Deleted: ${id} successfully deleted from Database.`);
            callback(null);
        });
    }

    PatchDB (sql, data, callback) {
        const props = Object.keys(data) 
        const {id, [props[1]]: value} = data;
        console.log(sql);
        
        this._db.run(sql, [value, id], function (err) {
            if(err) callback (err);

            console.log("successfully writing to Database.");
            callback(data);

            
        });
    };
}


// const getDatabasePath = () => {
//     return path.resolve(__dirname, 'node-rest-shop.db');
// }

module.exports = localdb;