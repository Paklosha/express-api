const FileModel = require('../models/file.model');
const HttpException = require('../utils/HttpException.utils');
const dotenv = require('dotenv');
const fs = require('fs')
const path = require('path')

dotenv.config();

class UserController {
    getList = async (req, res, next) => {
        const page = req.query.page ? req.query.page : 1
        const listSize = req.query.list_size ? req.query.list_size : 10
        const result = await FileModel.getList({ page, listSize })
        res.send({ result })

    }
    downloadFile = async (req, res, nex) => {
        const { id } = req.params;
        const name = await FileModel.getName({ id })

        res.download(path.resolve('src/uploads') + '/' + name, (err) => {
            if (err) {
                res.status(500).send({
                    message: "File can not be downloaded: " + err,
                });
            }
        });
    }
    getFile = async (req, res, next) => {
        const { id } = req.params;
        const file = await FileModel.getFile({ id })
        if (!file) {
            res.send('File doesnt exist!');
        }
        res.send(file)
    }
    deleteFile = async (req, res, next) => {
        const { id } = req.params;
        const name = await FileModel.getName({ id })

        await FileModel.deleteFile({ id });
        try {
            fs.unlinkSync(path.resolve('src/uploads') + '/' + name)
        } catch (err) {
            console.error(err)
        }
        res.send({ msg: 'File was deleted!' });
    }

    fileUpdate = async (req, res, next) => {
        const { id } = req.params;
        const file = await FileModel.getFile({ id })

        if (!file) throw new HttpException(401, 'No such file!');

        try {
            fs.unlinkSync(path.resolve('src/uploads') + '/' + file.name)
        } catch (err) {
            console.error(err)
        }

        if (!req.file) {
            throw new HttpException(401, 'No file recieved!');
        } else {
            const result = await FileModel.add({
                name: req.file.filename,
                extension: req.file.filename.split('.')[1],
                type: req.file.mimetype,
                size: req.file.size
            });

            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }
            res.send({ msg: 'File was updated!' });
        }
    }
    fileUpload = async (req, res, next) => {
        if (!req.file) {
            throw new HttpException(401, 'No file recieved!');
        } else {
            const result = await FileModel.add({
                name: req.file.filename,
                extension: req.file.filename.split('.')[1],
                type: req.file.mimetype,
                size: req.file.size
            });

            if (!result) {
                throw new HttpException(500, 'Something went wrong');
            }

            res.send({ msg: 'File was uploaded!' });
        }
    };
}

module.exports = new UserController;