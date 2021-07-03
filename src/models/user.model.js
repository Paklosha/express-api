const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
class UserModel {
    tableName = 'user';

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    }

    create = async ({ id, password }) => {
        const sql = `INSERT INTO ${this.tableName}
        (id, password) VALUES (?,?)`;
        const result = await query(sql, [id, password]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
}

module.exports = new UserModel;