const UserModel = require('../models/user.model');
const BlacklistModel = require('../models/blacklist.model');
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const exec = require("child_process").exec;
const errs = require("restify-errors");

dotenv.config();

class UserController {
    latency = async (req, res, next) => {
        exec("ping -c 1 " + 'github.com',
            function (err, stdout) {
                if (err) {
                    next(new errs.BadRequestError(err.message));
                } else {
                    res.send({ pingTime: stdout.match(/time=\d+.\d+/)[0].substring(5) });
                }
            }
        );
    }

    getCurrentUser = async (req, res, next) => {
        const { id } = req.currentUser;
        res.send(id);
    };

    newToken = async (req, res, next) => {
        const authHeader = req.headers.authorization;
        const bearer = 'Bearer ';

        if (!authHeader || !authHeader.startsWith(bearer)) {
            throw new HttpException(401, 'Access denied. No credentials sent!');
        }

        const token = authHeader.replace(bearer, '');
        const decoded = jwt.verify(token, process.env.SECRET_REFRESH_JWT);
        const user = await UserModel.findOne({ id: decoded.user_id });

        if (!user) {
            throw new HttpException(401, 'User doesnt exist!');
        }
        const new_token = jwt.sign({ user_id: user.id }, process.env.SECRET_JWT, {
            expiresIn: process.env.TOKEN_LIFE
        });
        res.send({ new_token, refresh_token: token });
    };

    getLogout = async (req, res, next) => {
        const authHeader = req.headers.authorization;
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.SECRET_JWT);
        const user = await UserModel.findOne({ id: decoded.user_id });
        const token = jwt.sign({ user_id: user.id.toString() }, process.env.SECRET_JWT, {
            expiresIn: process.env.TOKEN_LIFE
        });
        const result = await BlacklistModel.add({ id: user.id, token: authHeader });

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }
        res.send({ token });
    };

    createUser = async (req, res, next) => {
        if (!(/^7[0-9]{10}$/.test(req.body.id)) &&
            !(/\S+@\S+\.\S+/.test(req.body.id))
        ) {
            throw new HttpException(401, 'Unable to create a user!');
        }

        await this.hashPassword(req);
        const result = await UserModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }
        const token = jwt.sign({ user_id: req.body.id }, process.env.SECRET_JWT, {
            expiresIn: process.env.TOKEN_LIFE
        });
        const refresh_token = jwt.sign({ user_id: req.body.d }, process.env.SECRET_REFRESH_JWT, {
            expiresIn: process.env.REFRESH_TOKEN_LIFE
        });
        res.send({ token, refresh_token, msg: "User was created!" });
    };

    userLogin = async (req, res, next) => {
        const user = await UserModel.findOne({ id: req.body.id });
        if (!user) {
            throw new HttpException(401, 'User isnt found!');
        }

        if (!(/^7[0-9]{10}$/.test(req.body.id)) &&
            !(/\S+@\S+\.\S+/.test(req.body.id))
        ) {
            throw new HttpException(401, 'Unable to login!');
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        const token = jwt.sign({ user_id: user.id.toString() }, process.env.SECRET_JWT, {
            expiresIn: process.env.TOKEN_LIFE
        });
        res.send({ token });
    };

    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}

module.exports = new UserController;