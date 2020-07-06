const { Router } = require('express');
const { getAll, getMyAll, getById, create, update, remove } = require('./controllers');
const authentication = require('../../middlewares/authentication');

const taskRouter = Router();

taskRouter.get('/', getAll);
taskRouter.get('/getMyAll', authentication, getMyAll);
taskRouter.get('/:id', authentication, getById);
taskRouter.post('/create', authentication, create);
taskRouter.patch('/update/:id', authentication, update);
taskRouter.delete('/:id', authentication, remove);

module.exports = {
    taskRouter
}