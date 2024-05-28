const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'tasks.db');
let db;

function createDatabase() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database', err);
        } else {
            db.run(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    description TEXT
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating table', err);
                }
            });
        }
    });
}

function addTask(description) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO tasks (description) VALUES (?)', [description], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function getTasks() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM tasks', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function deleteTask(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function updateTask(id, description) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE tasks SET description = ? WHERE id = ?', [description, id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = { createDatabase, addTask, getTasks, deleteTask, updateTask };
