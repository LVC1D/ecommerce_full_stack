const express = require('express');
const app = express();
const port = 3400;
const https = require('https');
const fs = require('fs');
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

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'myapp.local-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'myapp.local.pem'))
};

app.use(cors({
    origin: 'https://localhost:5173',
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(partials());

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(morgan("dev"));
app.use(helmet());
app.use(flash());

// initialized AFTER the body-parsing, cors-ing and json-ifying middleware
initAuth(app);

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

https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Server started at https://localhost:${port}`);
});