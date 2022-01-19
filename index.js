// Thanks to https://www.youtube.com/watch?v=Q0a0594tOrc&ab_channel=KrisFoster

require('dotenv').config();
const port = process.env.PORT;

require('./Auth');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const app = express();

// Middlewares
app.use(session({ secret: process.env.EXPRESS_SESSION_SECRET })); // For session management
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<a href="/auth/google/">Sign In With Google</a>')
});

// Middleware to check if user is logged in 
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/protected', isLoggedIn, (req, res) => {
    console.log(req);
    res.send(`Hi ${req.user.displayName}`);
});

// Auth End Points
// End point where passports does the authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Callback 
app.get('/auth/google/callback', (req, res) => {
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    });
});

app.get('/auth/failure', (req, res) => {
    res.send('Failed to Authenticate');
});

// Logout
app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    req.send('Bye');
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});