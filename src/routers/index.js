const { Router } = require('express');
const { userRouter } = require('./user');
const { taskRouter } = require('./task');

const rootRouter = Router();

rootRouter.use('/task', taskRouter)
rootRouter.use('/user', userRouter)

module.exports = {
    rootRouter
}