// start server
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { ensureAdmin } = require('./seed');

const port = process.env.PORT || 3000;

connectDB()
    .then(() => ensureAdmin())
    .catch(() => {
        // DB connect failed; server will still attempt to start
    });

app.listen(port, () => {
        // server started
});