const express = require('express');
const authRouter = express.Router();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
require('dotenv').config();
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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CLIENT_CALLBACK,
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Attempt to find the user in the database
        const existingUserQuery = 'SELECT * FROM users WHERE facebook_id = $1';
        const existingUserResult = await pool.query(existingUserQuery, [profile.id]);

        if (existingUserResult.rows.length > 0) {
            // User found, return existing user
            return done(null, existingUserResult.rows[0]);
        } else {
            // No user found, create a new user in the database

            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
            if (!email) {
                // Handle the case where email is not available
                console.error("Email is required but was not provided by Facebook");
                return done(new Error("Email is required but was not provided by Facebook"));
            }

            const fallbackUsername = email.split('@')[0];

            const placeholderPassword = crypto.lib.WordArray.random(128 / 8).toString();
            const newUserQuery = 'INSERT INTO users (name, email, username, facebook_id, password) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const newUserValues = [
                profile.displayName || 'Unknown', // Fallback for displayName
                email, // Use the safely extracted email
                fallbackUsername, // Fallback to local-part of email if username is not available
                profile.id,
                placeholderPassword
            ];

            const newUserResult = await pool.query(newUserQuery, newUserValues);
            return done(null, newUserResult.rows[0]);
        }
    } catch (err) {
        console.error("Error during Facebook authentication:", err);
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

authRouter.get('/is_logged_in', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ user: req.user });
    } else {
        return res.status(401).json({ error: 'Not authenticated' });
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

authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

authRouter.get('/facebook/callback', 
    passport.authenticate('facebook', { 
        failureRedirect: '/login',
        failureMessage: "Failed to authenticate. Try again.",
    }), (req, res) => {
        console.log('Facebook login successful, user:', req.user);
        res.redirect('/');
    }
);

const initAuth = (app) => {
    app.set('trust proxy', 1);
    app.use(session({
        secret: process.env.CLIENT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: true,
            httpOnly: true, 
            maxAge: 360000000,
            sameSite: 'none'
        },
        store: store
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports = {authRouter, initAuth};