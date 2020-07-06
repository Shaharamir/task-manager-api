const Task = require('../../models/task');

const getAll = async (req, res, next) => {
    try {
        const tasks = await Task.find({});
        if (tasks.length > 0) {
            return res.send(tasks);
        }
        res.status(404).send();
    } catch (err) {
        res.status(500).send()
    }
};

const getMyAll = async (req, res, next) => {
    try {
        const match = {}; 
        const sort = {};

        if (req.query.completed) {
            if (req.query.completed === 'true') {
                match.completed = true;
            }
            if (req.query.completed === 'false') {
                match.completed = false;
            }
        }

        if(req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        if (req.user.tasks.length > 0) {
            return res.send(req.user.tasks);
        }
        res.status(404).send();
    } catch (err) {
        res.status(500).send()
    }
};

const getById = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send()
        }
        res.send(task);
    }
    catch (err) {
        res.status(500).send(err)
    }
};

const create = async (req, res, next) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
};

const update = async (req, res, next) => {
    try {
        const givenUpdateFields = Object.keys(req.body);
        const allowedUpdateFields = ['completed', 'description'];
        const isValidGivenFields = givenUpdateFields.every((givenUpdateField) => {
            return allowedUpdateFields.includes(givenUpdateField);
        })

        if (!isValidGivenFields) {
            return res.status(400).send({ error: 'given fields are not allowed', "allowed fields": allowedUpdateFields })
        }

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send()
        }

        givenUpdateFields.forEach((givenField) => task[givenField] = req.body[givenField]);
        await task.save();

        res.send(task);

    } catch (err) {
        res.status(400).send(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getAll,
    getMyAll,
    getById,
    create,
    update,
    remove
}