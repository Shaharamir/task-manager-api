const express = require('express');
const { rootRouter } = require('./routers');
require('./db/mongoose');

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(rootRouter);

app.get('/', (req, res) => {
    res.send('I am alive');
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})