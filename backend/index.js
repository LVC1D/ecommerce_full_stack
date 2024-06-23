const express = require('express');
const app = express();
const port = 3400;
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const partials = require('express-partials');
const flash = require('connect-flash');
const { ensureAuthenticated } = require('./helpers');
require('dotenv').config();
const {pool} = require('./model/database');
const {authRouter, initAuth} = require('./apiRoutes/auth');
const productRouter = require('./apiRoutes/products')(pool);
const orderRouter = require('./apiRoutes/orders')(pool, ensureAuthenticated);

initAuth(app);

app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(partials());

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(morgan("tiny"));
app.use(helmet());
app.use(flash());
app.use('/api/auth', authRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
    console.log("Server started at port " + port)
});