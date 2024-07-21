const express = require('express');
const app = express();
const port = process.env.PORT || 3400;
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const partials = require('express-partials');
const flash = require('connect-flash');
const { ensureAuthenticated, calculateSubtotal, incrementItemCount } = require('./helpers');
require('dotenv').config();
const {pool} = require('./model/database');
const {authRouter, initAuth} = require('./apiRoutes/auth');
const productRouter = require('./apiRoutes/products')(pool);
const orderRouter = require('./apiRoutes/orders')(pool, ensureAuthenticated);
const userRouter = require('./apiRoutes/users')(pool, ensureAuthenticated);
const cartRouter = require('./apiRoutes/cart')(pool, ensureAuthenticated, calculateSubtotal, incrementItemCount);
const csrfProtection = require('./csrfConfig');

// const sslOptions = {
//     key: fs.readFileSync(path.join(__dirname, 'certs', 'myapp.local-key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'certs', 'myapp.local.pem'))
// };

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.use(partials());

app.use(flash());

// initialized AFTER the body-parsing, cors-ing and json-ifying middleware
initAuth(app);

app.use(csrfProtection);

app.use((req, res, next) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken, {
        secure: process.env.NODE_ENV === 'production', //true
        httpOnly: false,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' //'none'
    });
    res.locals.csrfToken = csrfToken;
    console.log('CSRF token:', csrfToken);
    next();
});

app.use('/api/auth', authRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);
app.use('/cart', cartRouter);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// https.createServer(sslOptions, app).listen(port, () => {
//     console.log(`Server started at https://localhost:${port}`);
// });

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});