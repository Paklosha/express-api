const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
class BlacklistModel {
    tableName = 'blacklist';

    find = async ({ id, token }) => {
        const sql = `SELECT * FROM ${this.tableName}
        WHERE id = ? and token = ?`;
        const result = await query(sql, [id, token]);
        return result[0];
    }

    add = async ({ id, token }) => {
        const sql = `INSERT INTO ${this.tableName}
        (id, token) VALUES (?,?)`;
        const result = await query(sql, [id, token]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
}

module.exports = new BlacklistModel;