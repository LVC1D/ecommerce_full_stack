const express = require('express');
const authRouter = express.Router();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const store = new session.MemoryStore();
const {pool} = require('../model/database');

passport.use(new LocalStrategy(async function verify(username, password, done) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    } catch(err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
      
passport.deserializeUser(async (id, done) => {
    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return done(null, false);
        }

        done(null, result.rows[0]);
    } catch (err) {
        done(err);
    }
});

async function registerUser({username, password, name, email, address}) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.query('INSERT INTO users (name, email, username, address, password) VALUES ($1, $2, $3, $4, $5)', [name, email, username, address, hashedPassword]);
};

authRouter.post('/register', async (req, res, next) => {
    try {
        const { email, name, username, password, address } = req.body;

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (email, name, username, password, address) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, email, name, username, address`,
            [email, name, username, hashedPassword, address]
        );

        const newUser = result.rows[0];

        req.logIn(newUser, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(201).json(newUser);
        });
    } catch (error) {
        next(error);
    }
});

authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

authRouter.get("/login/success", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ message: "Login route accessed successfully" });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});

const initAuth = (app) => {
    app.use(session({
        secret: 'nfdjgf_74bB7v',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: false, maxAge: 3600000 },
        store: store
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports = {authRouter, initAuth};