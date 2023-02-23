const mysql = require("mysql2");
const fs = require("fs-extra");

class Dao 
{    
    constructor(connectionArgs) {
        this._connection = mysql.createConnection(connectionArgs);
    };

    close() {
        this._connection.end();
    };

    getAllTasks(callback) {
        const sql = `SELECT *, (SELECT
            CONCAT('[', 
            GROUP_CONCAT(JSON_OBJECT('id_file', f.id_file, 'id_task', f.id_task, 'name_user', f.name_user, 'name_local_fs', f.name_local_fs) SEPARATOR ','),
                   ']') FROM files f WHERE f.id_task = tasks.id_task) AS attached_files
            FROM tasks;`;
        this._connection.query(sql, function(err, result, fields) {
            callback(err,result,fields);
        });
    };

    downloadFile(id, callback) {
        const sql = 'SELECT name_user, name_local_fs FROM files WHERE files.id_file = ?';
        this._connection.query(sql, [id], function(err, result, fields) {
            callback(err,result,fields);
        });
    }

    deleteFiles(fileIDs, callback) {
        const sqlIDs = Array.isArray(fileIDs)?fileIDs.join(','):fileIDs;
		const selectsql = `SELECT name_local_fs FROM files WHERE files.id_file IN (` + sqlIDs + `)` ;
        this._connection.query(selectsql, function(err, result, fields) {
            if (!err) {
                for (const file of result) {
                    fs.removeSync("userfiles/" + file.name_local_fs);
                }
                const deletesql = `DELETE FROM files WHERE files.id_file IN (` + sqlIDs + `)`;
                this._connection.query(deletesql);
            }
            callback(err, result, fields);
        }.bind(this));
    }

    registerFile(idTask, originalName, newFileName, multerCallback) {
        const sql = `INSERT INTO files (id_task, name_user,  name_local_fs) VALUES (?, ?, ?)`;
        this._connection.query(sql, [idTask, originalName, newFileName], function(err, result, fields) {
            multerCallback(err, newFileName);
        });
    }

    getTask (id, callback) {
        const sql = `SELECT *, (SELECT
            CONCAT('[', 
            GROUP_CONCAT(JSON_OBJECT('id_file', f.id_file, 'id_task', f.id_task, 'name_user', f.name_user, 'name_local_fs', f.name_local_fs) SEPARATOR ','),
                   ']') FROM files f WHERE f.id_task = ?) AS attached_files
            FROM tasks WHERE tasks.id_task = ?;`;
        this._connection.query(sql, [id, id], function(err, result, fields) {
            callback(err, result, fields);
        });    
    };

    updateContent(id, title, description, status, timeExpired, callback) {
        const sql = `UPDATE tasks SET tasks.title = ?, tasks.description = ?, tasks.status = ?, tasks.time_expired = ? WHERE tasks.id_task = ?`;
        this._connection.query(sql, [title, description, status, timeExpired, id], function(err, result, fields) {
            callback(err,result,fields);
        });
    }

    addTask(title, description, status, timeExpired, callback) {
        const timeCreated = new Date().toISOString().slice(0, 19).replace('T',' ');
        const sql = `INSERT INTO tasks (title, description, status, time_created, time_expired) VALUES (?,?,?,?,?)`;
        this._connection.query(sql, [title, description, status, timeCreated, timeExpired], function(err, result, fields) {
            callback(err,result,fields);
        });
    }

    deleteTask(id, callback) {
        const selectsql = `SELECT name_local_fs FROM files WHERE files.id_task = ?`;
        this._connection.query(selectsql, [id], function(err, result, fields) {
            if (result && !err) {
                for (const file of result) {
                    fs.removeSync("userfiles/" + file.name_local_fs); 
                }
                const deletesql_f = `DELETE FROM files WHERE files.id_task = ?`;
                this._connection.query(deletesql_f, [id], function(err, result, fields) {
                    const deletesql_t = `DELETE FROM tasks WHERE tasks.id_task = ?`;
                    this._connection.query(deletesql_t, [id], function(err, result, fields) {
                        callback(err, result, fields);
                    });
                }.bind(this));
            } else {
                callback(err, result, fields);
            }
        }.bind(this));
    }
}

const dbpassword = fs.readFileSync("./model/db/dbpassword.txt", {encoding:"utf-8"});
const dao = new Dao({
    host: "localhost",
    user: "webuser",
    database: "taskmanager",
    password: dbpassword
});

module.exports.instance = dao;