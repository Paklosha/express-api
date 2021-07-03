const query = require('../db/db-connection');
class FileModel {
    tableName = 'file';

    add = async ({ name, extension, type, size }) => {
        const sql = `INSERT INTO ${this.tableName}
        (name, extension, type, size) VALUES (?,?,?,?)`;
        const result = await query(sql, [name, extension, type, size]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }

    deleteFile = async ({ id }) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
    getName = async ({ id }) => {
        const sql = `SELECT name FROM ${this.tableName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        return result[0].name;
    }
    getFile = async ({ id }) => {
        const sql = `SELECT * FROM ${this.tableName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        console.log(result)
        return result[0];
    }

    getList = async ({ page, listSize }) => {
        const sql = `SELECT * FROM ${this.tableName} LIMIT ?,?`
        const result = await query(sql, [String((page - 1) * listSize), String(listSize)]);
        console.log(result)
        return result;
    }
}

module.exports = new FileModel;