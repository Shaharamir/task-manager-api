const { Router } = require('express');
const { getAll, getById, create, update, updateMe, remove, removeMe, login, getMe, logout, logoutAll, uploadAvatar, deleteAvatar, getAvatarById } = require('./controllers');
const authentication = require('../../middlewares/authentication');
const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return callback(new Error('Please upload a PNG, JPG or JPEG'));
        }

        callback(undefined, true);
    }
})
const errorHandler = (error, req, res, next) => {
    res.status(400).send({ error: error.message })
}

const userRouter = Router();

userRouter.get('/', getAll);
userRouter.get('/me', authentication, getMe);
userRouter.get('/getById/:id', getById);
userRouter.post('/create', create);
userRouter.post('/login', login);
userRouter.post('/logout', authentication, logout);
userRouter.post('/logoutAll', authentication, logoutAll);
userRouter.patch('/update/me', authentication, updateMe);
userRouter.patch('/updateById/:id', update);
userRouter.delete('/me', authentication, removeMe);
userRouter.delete('/deleteById/:id', remove);
userRouter.post('/me/avatar', authentication, upload.single('avatar'), uploadAvatar, errorHandler);
userRouter.delete('/me/avatar', authentication, deleteAvatar);
userRouter.get('/:id/avatar', getAvatarById);

module.exports = {
    userRouter
}