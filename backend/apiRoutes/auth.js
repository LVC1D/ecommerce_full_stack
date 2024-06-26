const express = require('express');
const authRouter = express.Router();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const store = new session.MemoryStore();
const {pool} = require('../model/database');
const crypto = require('crypto-js');

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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Attempt to find the user in the database
        const existingUserQuery = 'SELECT * FROM users WHERE google_id = $1';
        const existingUserResult = await pool.query(existingUserQuery, [profile.id]);

        if (existingUserResult.rows.length > 0) {
            // User found, return existing user
            return done(null, existingUserResult.rows[0]);
        } else {
            // No user found, create a new user in the database

            const placeholderPassword = crypto.lib.WordArray.random(128 / 8).toString();
            const newUserQuery = 'INSERT INTO users (name, email, username, google_id, password) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const newUserValues = [
                profile.displayName, 
                profile.emails[0].value, 
                profile.emails[0].value.split('@')[0], 
                profile.id,
                placeholderPassword
            ];

            const newUserResult = await pool.query(newUserQuery, newUserValues);
            return done(null, newUserResult.rows[0]);
        }
    } catch (err) {
        console.error("Error during Google authentication:", err);
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

authRouter.get("/is_logged_in", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { id } = req.user;
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            if (!user) {
                throw createError(404, 'User record not found');
            }

            if (user.rows.length === 0) {
                return res.status(404).json({ message: 'User record not found' });
            }

            const userData = { ...user.rows[0] };
            delete userData.password; // Remove sensitive data

            res.status(200).json({
                user: userData,
                message: "Login route accessed successfully"
            });
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});

authRouter.get('/google', passport.authenticate('google', 
    { scope: ['profile', 'email'] }));
    

authRouter.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login',
        failureMessage: "Failed to authenticate. Try again.",
    }), (req, res) => {
        console.log('Google login successful, user:', req.user);
        res.redirect('/');
    }
);

const initAuth = (app) => {
    app.set('trust proxy', 1);
    app.use(session({
        secret: 'nfdjgf_74bB7v',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: app.get('env') === 'production',
            httpOnly: true, 
            maxAge: 3600000 
        },
        store: store
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports = {authRouter, initAuth};