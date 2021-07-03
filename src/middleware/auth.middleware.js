const HttpException = require('../utils/HttpException.utils');
const UserModel = require('../models/user.model');
const BlacklistModel = require('../models/blacklist.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = () => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';
            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new HttpException(401, 'Access denied. No credentials sent!');
            }
            const token = authHeader.replace(bearer, '');
            const secretKey = process.env.SECRET_JWT || "";
            const decoded = jwt.verify(token, secretKey);
            const user = await UserModel.findOne({ id: decoded.user_id });
            if (!user) {
                throw new HttpException(401, 'Authentication failed!');
            }
            const isTokenBlocked = await BlacklistModel.find({ id: user.id, token: authHeader });
            if (isTokenBlocked) {
                throw new HttpException(401, 'Token is blacklisted!');
            }
            req.currentUser = user;
            next();

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

module.exports = auth;