const mongoose = require('mongoose');

const mongooseConnect = mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

module.exports = {
    mongooseConnect
}