const User = require('../../models/user');
const { sendWelcomeEmail, sendCancellationEmail } = require('../../emails/account');
const sharp = require('sharp');

const getAll = async (req, res, next) => {
    try {
        const users = await User.find({});
        if (users.length < 0) {
            return res.send(404).send();
        }
        res.send(users);
    } catch (err) {
        res.status(500).send()
    }
};

const getById = async (req, res, next) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user);
    }
    catch (err) {
        res.status(500).send(err)
    }
};

const create = async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
};

const update = async (req, res, next) => {
    try {
        const givenUpdateFields = Object.keys(req.body);
        const allowedUpdateFields = ['name', 'email', 'password', 'age'];
        const isValidGivenFields = givenUpdateFields.every((givenUpdateField) => {
            return allowedUpdateFields.includes(givenUpdateField);
        })

        if (!isValidGivenFields) {
            return res.status(400).send({ error: 'given fields are not allowed', "allowed fields": allowedUpdateFields })
        }

        const user = await User.findById(req.params.id);
        givenUpdateFields.forEach((givenField) => user[givenField] = req.body[givenField])
        await user.save();

        if (!user) {
            return res.status(404).send()
        }

        res.send(user);

    } catch (err) {
        res.status(400).send(err);
    }
};

const updateMe = async (req, res, next) => {
    try {
        const givenUpdateFields = Object.keys(req.body);
        const allowedUpdateFields = ['name', 'email', 'password', 'age'];
        const isValidGivenFields = givenUpdateFields.every((givenUpdateField) => {
            return allowedUpdateFields.includes(givenUpdateField);
        })

        if (!isValidGivenFields) {
            return res.status(400).send({ error: 'given fields are not allowed', "allowed fields": allowedUpdateFields })
        }

        givenUpdateFields.forEach((givenField) => req.user[givenField] = req.body[givenField])
        await req.user.save();
        res.send(req.user);

    } catch (err) {
        res.status(400).send(err);
    }
}

const remove = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        sendCancellationEmail(user.email, user.name);
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

const removeMe = async (req, res, next) => {
    console.log('in');
    try {
        console.log(req.user);
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (err) {
        res.status(500).send(err);
    }
}

const login = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    }
    catch (err) {
        res.status(400).send(err);
    }
}

const getMe = async (req, res, next) => {
    res.send(req.user);
}

const logout = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(400).send()
    }
}

const logoutAll = async (req, res, next) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(400).send();
    }
}

const uploadAvatar = async (req, res, next) => {
    try {
        const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.set('Content-Type', 'image/png');
        res.send();
    }
    catch (err) {
        res.status(400).send();
    }
}

const deleteAvatar = async (req, res, next) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    }
    catch (err) {
        res.status(400).send();
    }
}

const getAvatarById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            return res.status(404).send();
        }

        res.set('Content-Type', 'image/jpeg');
        res.send(user.avatar);
    }
    catch (err) {
        res.status(400).send();
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    updateMe,
    remove,
    removeMe,
    login,
    getMe,
    logout,
    logoutAll,
    uploadAvatar,
    deleteAvatar,
    getAvatarById
}